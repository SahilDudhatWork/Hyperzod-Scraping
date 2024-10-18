const axios = require("axios");

const fetchId = async (code) => {
  const url =
    "https://www.travisperkins.co.uk/federation-graphql?op=categoriesByCodesTpplc";

  const headers = {
    "content-type": "application/json",
  };

  const data = {
    query: `
    query categoriesByCodesTpplc($brandId: ID!, $categoryCodes: [String!]!, $salesChannel: TpplcSalesChannel!) {
      tpplcBrand(brandId: $brandId) {
        categoriesByCode(categoryCodes: $categoryCodes, salesChannel: $salesChannel) {
          code
          name
          id
          description
          metaTitle
          metaDescription
          ...ParentCategoryTree
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
          subCategories {
            code
            name
            description
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
            subCategories {
              code
              __typename
            }
            __typename
          }
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
    fragment ParentCategoryTree on TpplcCategory {
      parentCategories {
        ...SubCategory
        parentCategories {
          ...SubCategory
          parentCategories {
            ...SubCategory
            parentCategories {
              ...SubCategory
              parentCategories {
                ...SubCategory
              }
            }
          }
        }
      }
    }
  `,
    variables: {
      categoryCodes: [code],
      brandId: "tp",
      salesChannel: "ECOMMERCE",
    },
  };

  const response = await axios.post(url, data, { headers });

  return response.data.data.tpplcBrand.categoriesByCode[0].id;
};

module.exports = fetchId;
