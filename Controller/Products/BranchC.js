const fs = require("fs");
const path = require("path");
const RepositoryFactory = require("../../services/repositories/repositoryFactory");
const productRepository = RepositoryFactory.get("product");
let productNameSet = new Set();

const BranchC = async (data, parentCategory = "") => {
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
              values: ["0216", "SE15 6TH"],
            },
          ],
          first: 100,
          after: null,
          term: null,
        },
      },
      query:
        "query searchProducts($brandId: ID!, $input: TpplcProductSearchInput!) {\n  tpplcBrand(brandId: $brandId) {\n    searchProducts(input: $input) {\n      totalCount\n      autoCorrectQuery\n      searchRedirect\n      pageInfo {\n        endCursor\n        hasNextPage\n        __typename\n      }\n      edges {\n        product {\n          ...TPPLCProductFields\n          __typename\n        }\n        __typename\n      }\n      facets {\n        name\n        values {\n          value\n          count\n          ... on TpplcCategoryFacetValue {\n            category {\n              code\n              id\n              name\n              parentCategories {\n                code\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment TPPLCProductFields on TpplcProduct {\n  id\n  sku\n  name\n  description\n  minimumHirePeriod\n  type\n  baseProductId\n  review {\n    averageRating\n    numberOfReviews\n    __typename\n  }\n  primaryImage {\n    id\n    images {\n      type\n      url\n      altText\n      __typename\n    }\n    __typename\n  }\n  otherImages {\n    id\n    images {\n      type\n      url\n      altText\n      __typename\n    }\n    __typename\n  }\n  vatRate\n  parentCategories {\n    ...TPPLCParentCategoriesTree\n    __typename\n  }\n  technicalSpecifications {\n    name\n    value\n    __typename\n  }\n  featuresAndBenefits\n  variants {\n    product {\n      id\n      baseProductId\n      sku\n      name\n      description\n      review {\n        averageRating\n        numberOfReviews\n        __typename\n      }\n      vatRate\n      type\n      primaryImage {\n        id\n        images {\n          type\n          url\n          altText\n          __typename\n        }\n        __typename\n      }\n      otherImages {\n        id\n        images {\n          type\n          url\n          altText\n          __typename\n        }\n        __typename\n      }\n      parentCategories {\n        ...TPPLCParentCategoriesTree\n        __typename\n      }\n      ...TPPLCProductPriceFields\n      __typename\n    }\n    features {\n      name\n      value\n      __typename\n    }\n    __typename\n  }\n  dataSheets {\n    name\n    type\n    url\n    __typename\n  }\n  type\n  hireable\n  ...TPPLCProductPriceFields\n  __typename\n}\n\nfragment TPPLCProductPriceFields on TpplcProduct {\n  price {\n    price {\n      ... on TpplcBuyPrice {\n        promotionalPriceTiers {\n          finalPrice {\n            valueExVat\n            valueIncVat\n            __typename\n          }\n          minimumQuantity\n          promotionEndDate\n          promotionMessages\n          promotionType\n          __typename\n        }\n        retailPrice {\n          valueExVat\n          valueIncVat\n          __typename\n        }\n        tradePrice {\n          valueExVat\n          valueIncVat\n          __typename\n        }\n        typicalTradePrice {\n          valueExVat\n          valueIncVat\n          __typename\n        }\n        tradePriceType\n        __typename\n      }\n      ... on TpplcHirePrice {\n        retailHireRates {\n          period\n          rate {\n            valueExVat\n            valueIncVat\n            __typename\n          }\n          __typename\n        }\n        tradeHireRates {\n          period\n          rate {\n            valueExVat\n            valueIncVat\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    priceOnApplication\n    priceUom {\n      code\n      name\n      prefix\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TPPLCParentCategories on TpplcCategory {\n  code\n  name\n  __typename\n}\n\nfragment TPPLCParentCategoriesTree on TpplcCategory {\n  ...TPPLCParentCategories\n  parentCategories {\n    ...TPPLCParentCategories\n    parentCategories {\n      ...TPPLCParentCategories\n      parentCategories {\n        ...TPPLCParentCategories\n        parentCategories {\n          ...TPPLCParentCategories\n          parentCategories {\n            ...TPPLCParentCategories\n            parentCategories {\n              ...TPPLCParentCategories\n              parentCategories {\n                ...TPPLCParentCategories\n                parentCategories {\n                  ...TPPLCParentCategories\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}",
    };

    const response = await productRepository.getProducts(body);

    const productIds = response.data.data.tpplcBrand.searchProducts.edges
      .filter((el) => el?.product?.variants?.length == 0)
      .map((el) => el?.product?.id);

    let qtyData = {
      operationName: "stockTpplc",
      variables: {
        branchIds: ["0216"],
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

    if (response.data.data.tpplcBrand.searchProducts.edges.length === 0) {
      return;
    }

    // Ensure the `images` directory exists
    const imagesDir = path.join(__dirname, "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    response.data.data.tpplcBrand.searchProducts.edges.forEach((el) => {
      let productName = el?.product.name.trim().replace(/"/g, '""');
      let sellingPrice =
        el?.product?.price?.price?.typicalTradePrice?.valueExVat || 0;
      if (el?.product?.variants?.length == 0 && sellingPrice != 0) {
        let thumbnailImage;
        if (
          [
            "938251",
            "938208",
            "938182",
            "938169",
            "938155",
            "938196",
            "996242",
            "996244",
            "996248",
            "996241",
            "996272",
            "938191",
            "996245",
            "996239",
            "996226",
          ].includes(el?.product?.sku)
        ) {
          const imageUrl = el?.product?.otherImages[2]?.images[2]?.url;
          if (imageUrl) {
            if (el?.product?.sku == "938251") {
              thumbnailImage =
                "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938251.jpg";
            } else if (el?.product?.sku == "938208") {
              thumbnailImage =
                "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938208.jpg";
            } else if (el?.product?.sku == "938182") {
              thumbnailImage =
                "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938182.jpg";
            } else if (el?.product?.sku == "938169") {
              thumbnailImage =
                "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938169.jpg";
            } else if (el?.product?.sku == "938155") {
              thumbnailImage =
                "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938155.jpg";
            } else if (el?.product?.sku == "938196") {
              thumbnailImage =
                "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938196.jpg";
            } else {
              thumbnailImage =
                "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938155.jpg";
            }
          } else {
            console.error("Image URL not found.");
          }

          if (
            el?.product?.sku == "996242" ||
            productName == "Travis Perkins Grit/Sharp Sand Trade Pack"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938208.jpg";
          } else if (
            el?.product?.sku == "996244" ||
            productName == "Travis Perkins Gravel and Shingle Trade Pack 10mm"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938182.jpg";
          } else if (
            el?.product?.sku == "996248" ||
            productName == "Travis Perkins MOT Type 1 Sub Base Trade Pack"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938251.jpg";
          } else if (
            el?.product?.sku == "996241" ||
            productName == "Plastering Sand Trade Pack"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938196.jpg";
          } else if (
            el?.product?.sku == "996272" ||
            productName == "Silver Sand Trade Pack"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-996272.jpg";
          } else if (
            el?.product?.sku == "938191" ||
            productName == "Travis Perkins Gravel and Shingle Bulk Bag 20mm"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938191.jpg";
          } else if (
            el?.product?.sku == "996245" ||
            productName == "Travis Perkins Gravel and Shingle Trade Pack 20mm"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938191.jpg";
          } else if (
            el?.product?.sku == "996239" ||
            productName == "Travis Perkins Building Sand Trade Pack"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938208.jpg";
          } else if (
            el?.product?.sku == "996226" ||
            productName == "Travis Perkins Sand and Stone Ballast Trade Pack"
          ) {
            thumbnailImage =
              "//raw.githubusercontent.com/SahilDudhatWork/image-hosting/refs/heads/main/sku-938208.jpg";
          }
        } else {
          thumbnailImage = el?.product?.primaryImage?.images.find(
            (image) => image.type === "thumbnail"
          )?.url;
        }

        if (thumbnailImage) {
          thumbnailImage = thumbnailImage.split("?")[0];
        }

        let inventoryQty = productQtyMap.get(el?.product.id) || 0;
        let status = inventoryQty > 0 ? "ACTIVE" : "INACTIVE";

        // Check status and product name for duplicates
        let productCategory = parentCategory.trim();
        // let productName = el?.product.name.trim().replace(/"/g, '""');
        let productDescription = el?.product.description;
        productName = productName.replace("Travis Perkins", "Buildgo");
        productName = productName.replace("4Trade", "Buildgo");
        productName = productName.replace("4TRADE", "Buildgo");
        productDescription = productDescription.replace(
          "Travis Perkins",
          "Buildgo"
        );
        productDescription = productDescription.replace("4Trade", "Buildgo");
        productDescription = productDescription.replace("4TRADE", "Buildgo");

        const uniqueIdentifier = `${productCategory}-${productName}`;
        if (status === "ACTIVE" && !productNameSet.has(uniqueIdentifier)) {
          productNameSet.add(uniqueIdentifier); // Track the product name to avoid duplicates

          const randomNumber = Math.floor(100000 + Math.random() * 900000);
          const skuPlusRandomNumber = el?.product.sku + randomNumber;

          productArray.push({
            id: el?.product.sku || "N/A",
            name: productName || "N/A",
            image: `https:${thumbnailImage}` || "N/A",
            description: productDescription || "N/A",
            sku: el?.product.sku || "N/A",
            min: 1,
            max: inventoryQty,
            sellingPrice: sellingPrice,
            costPrice: sellingPrice,
            status: status,
            inventory: inventoryQty,
            skuPlusRandomNumber,
          });
        }
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

    if (productArray.length == 0) return;

    // Step 3: Format the CSV content for the validated products
    let csvContent = productArray
      .map((product) => {
        let percentageAmount = (15 / 100) * product.sellingPrice;
        let totalSellingPrice = product.sellingPrice + percentageAmount;
        let formattedTotalSellingPrice = totalSellingPrice.toFixed(2);

        const row = [
          `""`,
          `"${product.name}"`,
          `"${product.image}"`,
          `"${product.description.replace(/"/g, '""')}"`,
          `"${product.skuPlusRandomNumber}"`,
          `"${product.min},${product.max}"`,
          `${formattedTotalSellingPrice}`,
          `"${product.status}"`,
          `${product.inventory}`,
          `"${parentCategory}"`,
          `${product.sellingPrice}`,
          `""`,
          `20`,
        ];
        return row.join(",");
      })
      .join("\n");

    // ========================
    // =========  CSV Generator
    // ========================
    const csvFilePath = path.join(__dirname, "../../Temp/BranchC.csv");
    const fileExists = fs.existsSync(csvFilePath);

    // Step 4: Write or append the CSV
    if (!fileExists) {
      fs.writeFile(csvFilePath, csvHeaders + "\n" + csvContent, (err) => {
        if (err) {
          console.error("Error writing file", err);
        } else {
          // console.log(
          //   "Successfully wrote productArray with headers to BranchC"
          // );
        }
      });
    } else {
      fs.appendFile(csvFilePath, "\n" + csvContent, (err) => {
        if (err) {
          console.error("Error appending to file", err);
        } else {
          // console.log("Successfully appended new products to BranchC");
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data :-", error.message);
  }
};

module.exports = BranchC;
