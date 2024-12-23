const axios = require("axios");
const fs = require("fs");
const fetchId = require("./fetchId");

// Function to perform the API request
const fetchCategoryTree = async () => {
  try {
    const response = await axios({
      method: "post",
      url: "https://www.travisperkins.co.uk/graphql?op=categoryTreeTpplc",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
        "x-data-consumer-name": "TP-WEB",
        "x-tp-brand-id": "tp",
        "x-tp-checkout-new": "true",
        "x-tp-request-id": "b143abc5-011e-4944-ab9e-e7f6ca329154",
        "x-tp-session-id": "3e14679d-06a3-47af-9748-18096e52bea2",
      },
      data: {
        query: `
          query categoryTreeTpplc($brandId: ID!, $salesChannel: TpplcSalesChannel!) {
            tpplcBrand(brandId: $brandId) {
              categoryTree(salesChannel: $salesChannel) {
                ...SubCategoryTree
                __typename
              }
              __typename
            }
          }
          fragment SubCategory on TpplcCategory {
            code
            name
            image {
              name
              images {
                altText
                url
                type
                __typename
              }
              __typename
            }
            __typename
          }
          fragment SubCategoryTree on TpplcCategory {
            ...SubCategory
            subCategories {
              ...SubCategory
              subCategories {
                ...SubCategory
                subCategories {
                  ...SubCategory
                  subCategories {
                    ...SubCategory
                    subCategories {
                      ...SubCategory
                      subCategories {
                        ...SubCategory
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
        `,
        variables: {
          brandId: "tp",
          salesChannel: "ECOMMERCE",
        },
      },
    });

    let newData = response.data.data.tpplcBrand.categoryTree.subCategories;

    // Global Set to track unique codes across all levels
    const globalUniqueCodes = new Set();

    // Helper function to remove duplicates recursively across levels
    const filterUniqueCategories = async (categories) => {
      return await Promise.all(
        categories
          .filter((category) => {
            if (globalUniqueCodes.has(category.code)) {
              return false; // Skip if code is already added
            }
            globalUniqueCodes.add(category.code);
            return true;
          })
          .map(async (category) => {
            const uniqueSubCategories = category.subCategories
              ? await filterUniqueCategories(category.subCategories)
              : [];
            return {
              code: category.code,
              name:
                category.name == "Doors, Windows & Joinery"
                  ? "Doors-Windows & Joinery"
                  : category.name,
              id: await fetchId(category.code),
              subCategories: uniqueSubCategories,
            };
          })
      );
    };

    // Filter main categories for uniqueness
    newData = await filterUniqueCategories(newData);

    newData = newData.sort((a, b) => {
      if (a.name === "Timber & Sheet Materials") return 1; // Move this to the end
      if (b.name === "Timber & Sheet Materials") return -1;
      if (a.name === "Doors-Windows & Joinery") return 1; // Ensure this comes after "Timber & Sheet Materials"
      if (b.name === "Doors-Windows & Joinery") return -1;
      return 0; // Keep the rest of the order intact
    });

    // Write the final structured data to the JSON file
    fs.writeFile(
      "./Temp/categoryTree.json",
      JSON.stringify(newData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log(
            "Successfully wrote unique categoryTree data to categoryTree.json"
          );
        }
      }
    );
  } catch (error) {
    console.error("Error fetching category tree:", error);
    throw error; // Handle the error as needed
  }
};

// Function to read the category tree JSON file
const readCategoryTree = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./Temp/categoryTree.json", "utf8", (err, data) => {
      if (err) return reject(err);
      try {
        if (data) {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } else {
          resolve([]);
        }
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

module.exports = {
  fetchCategoryTree,
  readCategoryTree,
};
