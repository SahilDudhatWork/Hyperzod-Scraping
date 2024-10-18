const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const loginUser = async () => {
  const data = {
    email: "sahildudhat03@gmail.com",
    password: "SahilDudhat@81600",
  };

  try {
    const response = await axios.post(
      "https://api.hyperzod.app/auth/v1/tenant/user/login",
      data,
      {
        headers: {
          "content-type": "application/json",
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );

    return response.data.data.access_token;
  } catch (error) {
    console.error(
      "Error logging in:",
      error.response ? error.response.data : error.message
    );
  }
};

const getProductList = async (page, pageLimit, token, merchantId) => {
  try {
    const response = await axios.get(
      `https://api.hyperzod.app/merchant/v1/catalog/product/list?merchant_id=${merchantId}&page=${page}&page_limit=${pageLimit}`,
      {
        headers: {
          authorization: token,
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching product list:", error.message);
    throw new Error("Failed to fetch product list");
  }
};

const bulkDeleteProducts = async (products, token, merchantId) => {
  try {
    console.log("getProductList products length:>> ", products.length);
    const chunkArray = (array, chunkSize) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    };

    const productChunks = chunkArray(products, 50);

    for (const chunk of productChunks) {
      const queryParams = new URLSearchParams({
        tenant_id: 4266,
        merchant_id: merchantId,
      });

      chunk.forEach((item, index) => {
        queryParams.append(`products[${index}]`, item._id);
      });

      await axios.delete(
        `https://api.hyperzod.app/merchant/v1/catalog/product/bulk?${queryParams.toString()}`,
        {
          headers: {
            authorization: token,
            "x-client-medium": 3,
            "x-tenant": "onstruct.hyperzod.app",
          },
        }
      );
    }

    console.log("All products deleted successfully");
    return;
  } catch (error) {
    console.error("Error deleting products:", error);
    throw new Error("Bulk product deletion failed");
  }
};

const hyperzodUpload = async (token, filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(path.join(__dirname, filePath)));
  form.append("user_id", "214999");
  form.append("tenant_id", "4266");

  try {
    const response = await axios.post(
      "https://upload.hyperzod.app/upload",
      form,
      {
        headers: {
          ...form.getHeaders(),
          authorization: token,
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw new Error("File upload failed");
  }
};

const validateProductImport = async (data, token, merchantId) => {
  const requestBody = {
    tenant_id: 4266,
    merchant_id: merchantId,
    file_url: data.file_url,
    locale: "en",
  };

  try {
    const response = await axios.post(
      "https://api.hyperzod.app/merchant/v1/catalog/product/import/validate",
      requestBody,
      {
        headers: {
          authorization: token,
          "content-type": "application/json",
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response.data.message === "An import is already processing.") {
      await validateProductImport(data, token, merchantId);
    }
    console.log(
      "Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
    // throw new Error("Validation failed");
  }
};

const importProductData = async (data, token, merchantId) => {
  const requestBody = {
    tenant_id: 4266,
    merchant_id: merchantId,
    import_id: data.import_id,
  };

  try {
    const response = await axios.post(
      "https://api.hyperzod.app/merchant/v1/catalog/product/import",
      requestBody,
      {
        headers: {
          authorization: token,
          "content-type": "application/json",
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in product import:", error.message);
    throw new Error("Product import failed");
  }
};

module.exports = {
  loginUser,
  getProductList,
  bulkDeleteProducts,
  hyperzodUpload,
  validateProductImport,
  importProductData,
};
