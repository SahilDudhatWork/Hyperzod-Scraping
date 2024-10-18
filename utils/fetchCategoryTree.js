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

    // Use Promise.all to wait for all async operations to complete
    newData = await Promise.all(
      newData.map(async (i) => {
        let subCategories1 = await Promise.all(
          i.subCategories
            ? i.subCategories.map(async (subCg1) => {
                let subCategories2 = await Promise.all(
                  subCg1.subCategories
                    ? subCg1.subCategories.map(async (subCg2) => {
                        let subCategories3 = await Promise.all(
                          subCg2.subCategories
                            ? subCg2.subCategories.map(async (subCg3) => {
                                return {
                                  code: subCg3.code,
                                  name: subCg3.name,
                                  id: await fetchId(subCg3.code),
                                  subCategories: subCg3.subCategories || [],
                                };
                              })
                            : []
                        );

                        return {
                          code: subCg2.code,
                          name: subCg2.name,
                          id: await fetchId(subCg2.code),
                          subCategories: subCategories3 || [],
                        };
                      })
                    : []
                );

                return {
                  code: subCg1.code,
                  name: subCg1.name,
                  id: await fetchId(subCg1.code),
                  subCategories: subCategories2 || [],
                };
              })
            : []
        );

        return {
          code: i.code,
          name: i.name,
          id: await fetchId(i.code),
          subCategories: subCategories1 || [],
        };
      })
    );

    // Write the final structured data to the JSON file
    fs.writeFile(
      "./categoryTree.json",
      JSON.stringify(newData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log(
            "Successfully wrote categoryTree data to categoryTree2.json"
          );
        }
      }
    );
  } catch (error) {
    console.error("Error fetching category tree:", error);
    throw error; // Handle the error as needed
  }
};

const readCategoryTree = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./categoryTree.json", "utf8", (err, data) => {
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
