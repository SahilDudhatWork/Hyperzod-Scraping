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

// get products for delete
const merchantA_GetProductList = async (page, pageLimit, token, merchantId) => {
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
    console.error("merchant:A Error fetching product list:", error.message);
    throw new Error("Failed to fetch product list");
  }
};
const merchantB_GetProductList = async (page, pageLimit, token, merchantId) => {
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
    console.error("merchant:B Error fetching product list:", error.message);
    throw new Error("Failed to fetch product list");
  }
};
const merchantC_GetProductList = async (page, pageLimit, token, merchantId) => {
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
    console.error("merchant:C Error fetching product list:", error.message);
    throw new Error("Failed to fetch product list");
  }
};
const merchantD_GetProductList = async (page, pageLimit, token, merchantId) => {
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
    console.error("merchant:D Error fetching product list:", error.message);
    throw new Error("Failed to fetch product list");
  }
};

// delete old products
const merchantA_BulkDeleteProduct = async (products, token, merchantId) => {
  try {
    console.log(
      "merchant-A: getProductList products length:>> ",
      products.length
    );
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

    console.log("merchant:A All products deleted successfully");
    return;
  } catch (error) {
    console.error("merchant:A Error deleting products:", error);
    throw new Error("Bulk product deletion failed");
  }
};
const merchantB_BulkDeleteProduct = async (products, token, merchantId) => {
  try {
    console.log(
      "merchant-B: getProductList products length:>> ",
      products.length
    );
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

    console.log("merchant:B All products deleted successfully");
    return;
  } catch (error) {
    console.error("merchant:B Error deleting products:", error);
    throw new Error("Bulk product deletion failed");
  }
};
const merchantC_BulkDeleteProduct = async (products, token, merchantId) => {
  try {
    console.log(
      "merchant-C: getProductList products length:>> ",
      products.length
    );
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

    console.log("merchant:C All products deleted successfully");
    return;
  } catch (error) {
    console.error("merchant:C Error deleting products:", error);
    throw new Error("Bulk product deletion failed");
  }
};
const merchantD_BulkDeleteProduct = async (products, token, merchantId) => {
  try {
    console.log(
      "merchant-D: getProductList products length:>> ",
      products.length
    );
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

    console.log("merchant:D All products deleted successfully");
    return;
  } catch (error) {
    console.error("merchant:D Error deleting products:", error);
    throw new Error("Bulk product deletion failed");
  }
};

// check import process
const merchantA_CheckImportStatus = async (token, merchantId) => {
  const statusUrl = `https://api.hyperzod.app/merchant/v1/catalog/product/import?merchant_id=${merchantId}&page=1&import_type=product`;

  try {
    const response = await axios.get(statusUrl, {
      headers: {
        authorization: token,
        "x-client-medium": 3,
        "x-tenant": "onstruct.hyperzod.app",
      },
    });
    return response?.data?.data?.data.length > 0
      ? response?.data?.data?.data[0]?.import_status
      : "completed";
  } catch (error) {
    console.error("merchant:A Error checking import status:", error);
    throw error;
  }
};
const merchantB_CheckImportStatus = async (token, merchantId) => {
  const statusUrl = `https://api.hyperzod.app/merchant/v1/catalog/product/import?merchant_id=${merchantId}&page=1&import_type=product`;

  try {
    const response = await axios.get(statusUrl, {
      headers: {
        authorization: token,
        "x-client-medium": 3,
        "x-tenant": "onstruct.hyperzod.app",
      },
    });
    return response?.data?.data?.data.length > 0
      ? response?.data?.data?.data[0]?.import_status
      : "completed";
  } catch (error) {
    console.error("merchant:B Error checking import status:", error);
    throw error;
  }
};
const merchantC_CheckImportStatus = async (token, merchantId) => {
  const statusUrl = `https://api.hyperzod.app/merchant/v1/catalog/product/import?merchant_id=${merchantId}&page=1&import_type=product`;

  try {
    const response = await axios.get(statusUrl, {
      headers: {
        authorization: token,
        "x-client-medium": 3,
        "x-tenant": "onstruct.hyperzod.app",
      },
    });
    return response?.data?.data?.data.length > 0
      ? response?.data?.data?.data[0]?.import_status
      : "completed";
  } catch (error) {
    console.error("merchant:C Error checking import status:", error);
    throw error;
  }
};
const merchantD_CheckImportStatus = async (token, merchantId) => {
  const statusUrl = `https://api.hyperzod.app/merchant/v1/catalog/product/import?merchant_id=${merchantId}&page=1&import_type=product`;

  try {
    const response = await axios.get(statusUrl, {
      headers: {
        authorization: token,
        "x-client-medium": 3,
        "x-tenant": "onstruct.hyperzod.app",
      },
    });
    return response?.data?.data?.data.length > 0
      ? response?.data?.data?.data[0]?.import_status
      : "completed";
  } catch (error) {
    console.error("merchant:D Error checking import status:", error);
    throw error;
  }
};

// upload csv
const merchantA_HyperzodUpload = async (token, filePath) => {
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
    console.error("merchant:A Error uploading file:", error.message);
    throw new Error("File upload failed");
  }
};
const merchantB_HyperzodUpload = async (token, filePath) => {
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
    console.error("merchant:B Error uploading file:", error.message);
    throw new Error("File upload failed");
  }
};
const merchantC_HyperzodUpload = async (token, filePath) => {
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
    console.error("merchant:C Error uploading file:", error.message);
    throw new Error("File upload failed");
  }
};
const merchantD_HyperzodUpload = async (token, filePath) => {
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
    console.error("merchant:D Error uploading file:", error.message);
    throw new Error("File upload failed");
  }
};

// check csv validation
const merchantA_ValidateProductImport = async (data, token, merchantId) => {
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
      await merchantA_ValidateProductImport(data, token, merchantId);
    }
    console.log(
      "merchant:A Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
    // throw new Error("Validation failed");
  }
};
const merchantB_ValidateProductImport = async (data, token, merchantId) => {
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
      await merchantB_ValidateProductImport(data, token, merchantId);
    }
    console.log(
      "merchant:B Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
    // throw new Error("Validation failed");
  }
};
const merchantC_ValidateProductImport = async (data, token, merchantId) => {
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
      await merchantC_ValidateProductImport(data, token, merchantId);
    }
    console.log(
      "merchant:C Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
    // throw new Error("Validation failed");
  }
};
const merchantD_ValidateProductImport = async (data, token, merchantId) => {
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
      await merchantD_ValidateProductImport(data, token, merchantId);
    }
    console.log(
      "merchant:D Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
    // throw new Error("Validation failed");
  }
};

// import csv to hyperzod
const merchantA_ImportProductData = async (data, token, merchantId) => {
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
    console.error("merchant:A Error in product import:", error.message);
    throw new Error("Product import failed");
  }
};
const merchantB_ImportProductData = async (data, token, merchantId) => {
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
    console.error("merchant:B Error in product import:", error.message);
    throw new Error("Product import failed");
  }
};
const merchantC_ImportProductData = async (data, token, merchantId) => {
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
    console.error("merchant:C Error in product import:", error.message);
    throw new Error("Product import failed");
  }
};
const merchantD_ImportProductData = async (data, token, merchantId) => {
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
    console.error("merchant:D Error in product import:", error.message);
    throw new Error("Product import failed");
  }
};

module.exports = {
  loginUser,
  merchantA_GetProductList,
  merchantB_GetProductList,
  merchantC_GetProductList,
  merchantD_GetProductList,

  merchantA_BulkDeleteProduct,
  merchantB_BulkDeleteProduct,
  merchantC_BulkDeleteProduct,
  merchantD_BulkDeleteProduct,

  merchantA_HyperzodUpload,
  merchantB_HyperzodUpload,
  merchantC_HyperzodUpload,
  merchantD_HyperzodUpload,

  merchantA_ValidateProductImport,
  merchantB_ValidateProductImport,
  merchantC_ValidateProductImport,
  merchantD_ValidateProductImport,

  merchantA_ImportProductData,
  merchantB_ImportProductData,
  merchantC_ImportProductData,
  merchantD_ImportProductData,

  merchantA_CheckImportStatus,
  merchantB_CheckImportStatus,
  merchantC_CheckImportStatus,
  merchantD_CheckImportStatus,
};
