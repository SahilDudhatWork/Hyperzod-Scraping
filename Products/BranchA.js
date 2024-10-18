const fs = require("fs");
const path = require("path");
const RepositoryFactory = require("../services/repositories/repositoryFactory");
const productRepository = RepositoryFactory.get("product");
const csvParser = require("csv-parser");

const BranchA = async (data) => {
  try {
    let body = {
      operationName: "searchProducts",
      variables: {
        brandId: "tp",
        input: {
          salesChannel: "ECOMMERCE",
          categoryId: data.id,
          excludeFacets: [],
          facets: [
            {
              name: "localised",
              values: ["0320"],
            },
          ],
          first: 30,
          after: null,
          term: "se1",
        },
      },
      query: `query searchProducts($brandId: ID!, $input: TpplcProductSearchInput!) {
        tpplcBrand(brandId: $brandId) {
          searchProducts(input: $input) {
            totalCount
            autoCorrectQuery
            searchRedirect
            pageInfo {
              endCursor
              hasNextPage
              __typename
            }
            edges {
              product {
                ...TPPLCProductFields
                __typename
              }
              __typename
            }
            facets {
              name
              values {
                value
                count
                ... on TpplcCategoryFacetValue {
                  category {
                    code
                    id
                    name
                    parentCategories {
                      code
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
      }
      fragment TPPLCProductFields on TpplcProduct {
        id
        sku
        name
        description
        minimumHirePeriod
        type
        baseProductId
        review {
          averageRating
          numberOfReviews
          __typename
        }
        primaryImage {
          id
          images {
            type
            url
            altText
            __typename
          }
          __typename
        }
        vatRate
        parentCategories {
          ...TPPLCParentCategoriesTree
          __typename
        }
        technicalSpecifications {
          name
          value
          __typename
        }
        featuresAndBenefits
        variants {
          product {
            id
            sku
            name
            description
            vatRate
            primaryImage {
              id
              images {
                type
                url
                altText
                __typename
              }
              __typename
            }
            parentCategories {
              ...TPPLCParentCategoriesTree
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      fragment TPPLCParentCategoriesTree on TpplcCategory {
        code
        name
        __typename
      }`,
    };

    const response = await productRepository.getProducts(body);

    const productIds = response.data.data.tpplcBrand.searchProducts.edges
      .filter((el) => el?.product?.variants?.length == 0)
      .map((el) => el?.product?.id);

    let qtyData = {
      operationName: "stockTpplc",
      variables: {
        branchIds: ["0320"],
        productIds: productIds,
      },
      query: `query stockTpplc($branchIds: [ID!]!, $productIds: [ID!]!) {
        tpplcStock(branchIds: $branchIds, productIds: $productIds) {
          stock {
            branchId
            productId
            quantity
            uom
            __typename
          }
          __typename
        }
      }`,
    };

    const qtyResponse = await productRepository.getProductsQty(qtyData);
    const productQtyMap = new Map();
    qtyResponse.data.data.tpplcStock.stock.forEach((stockItem) => {
      productQtyMap.set(stockItem.productId, stockItem.quantity);
    });

    let productArray = [];

    response.data.data.tpplcBrand.searchProducts.edges.forEach((el) => {
      if (el?.product?.variants?.length == 0) {
        let thumbnailImage = el?.product?.primaryImage?.images.find(
          (image) => image.type === "thumbnail"
        )?.url;

        if (thumbnailImage) {
          thumbnailImage = thumbnailImage.split("?")[0];
        }

        let inventoryQty = productQtyMap.get(el?.product.id) || 0;

        let sellingPrice =
          el?.product?.price?.price?.typicalTradePrice?.valueIncVat || 0;
        let costPrice = el?.product?.price?.price?.costPrice || 0;

        productArray.push({
          id: el?.product.sku || "N/A",
          name: el?.product.name || "N/A",
          image: `https:${thumbnailImage}` || "N/A",
          description: el?.product.description || "N/A",
          sku: el?.product.sku || "N/A",
          min: 1,
          max: inventoryQty,
          sellingPrice: sellingPrice,
          costPrice: costPrice,
          status: inventoryQty > 0 ? "ACTIVE" : "INACTIVE",
          inventory: inventoryQty,
        });
      }
    });

    const csvHeaders = [
      "productid",
      "productname",
      "productimages",
      "productdescription",
      "productsku",
      "productminmaxquantity",
      "productpriceselling",
      "productstatus",
      "productinventory",
      "productcategory",
      "productpricecost",
      "productpricecompare",
      "producttax_percent",
      "productlabels",
      "producttags",
    ].join(",");

    const csvFilePath = path.join(__dirname, "../BranchA.csv");
    const fileExists = fs.existsSync(csvFilePath);

    let existingSkus = new Set();

    // Step 1: Read the existing CSV and get existing SKUs
    if (fileExists) {
      await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csvParser())
          .on("data", (row) => {
            existingSkus.add(row.productsku);
          })
          .on("end", resolve)
          .on("error", reject);
      });
    }

    // Step 2: Filter out products that already exist
    let newProducts = productArray.filter(
      (product) => !existingSkus.has(product.sku)
    );

    if (newProducts.length === 0) {
      console.log("No new products to add.");
      return;
    }

    // Step 3: Format the CSV content for the new products
    let csvContent = newProducts
      .map((product) => {
        let percentageAmount = (15 / 100) * product.sellingPrice;
        let totalSellingPrice = product.sellingPrice + percentageAmount;
        let formattedTotalSellingPrice = totalSellingPrice.toFixed(2);

        const row = [
          `""`,
          `"${product.name.replace(/"/g, '""')}"`,
          `"${product.image}"`,
          `"${product.description.replace(/"/g, '""')}"`,
          `"${product.sku}"`,
          `"${product.min},${product.max}"`,
          `${formattedTotalSellingPrice}`,
          `"${product.status}"`,
          `${product.inventory}`,
          `"${data.name}"`,
          `${product.costPrice}`,
        ];
        return row.join(",");
      })
      .join("\n");

    // Step 4: Write or append the CSV
    if (!fileExists) {
      fs.writeFile(csvFilePath, csvHeaders + "\n" + csvContent, (err) => {
        if (err) {
          console.error("Error writing file", err);
        } else {
          // console.log(
          //   "Successfully wrote productArray with headers to BranchA"
          // );
        }
      });
    } else {
      fs.appendFile(csvFilePath, "\n" + csvContent, (err) => {
        if (err) {
          console.error("Error appending to file", err);
        } else {
          // console.log("Successfully appended new products to BranchA");
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data :-", error.message);
  }
};

module.exports = BranchA;
