const RepositoryFactory = require("../services/repositories/repositoryFactory");
const productRepository = RepositoryFactory.get("product");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const logToFile = (logType, message) => {
  const logFilePath = path.join(__dirname, "../Temp/Api-Log.json");

  const logEntry = {
    timestamp: new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    timestampIND: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    logType,
    message,
  };

  if (fs.existsSync(logFilePath)) {
    fs.readFile(logFilePath, "utf8", (err, data) => {
      let logs = [];
      if (!err && data) {
        try {
          logs = JSON.parse(data);
        } catch (parseErr) {
          console.error("Error parsing log file:", parseErr);
          logs = [];

          fs.writeFileSync(
            logFilePath,
            JSON.stringify([logEntry], null, 2),
            "utf8"
          );
        }
      }
      logs.push(logEntry);

      fs.writeFile(
        logFilePath,
        JSON.stringify(logs, null, 2),
        "utf8",
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing to log file:", writeErr);
          }
        }
      );
    });
  } else {
    const logs = [logEntry];
    fs.writeFile(
      logFilePath,
      JSON.stringify(logs, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to log file:", writeErr);
        }
      }
    );
  }
};

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
    logToFile("success", "Login successful.");

    return response.data.data.access_token;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile("error", `Error logging in: ${errorMessage}`);

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
    logToFile(
      "success",
      `Fetched product list for Merchant A, ${response.data.data.data.length} products found.`
    );
    return response.data.data.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile(
      "error",
      `Merchant A - Error fetching product list: ${errorMessage}`
    );
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
    logToFile(
      "success",
      `Fetched product list for Merchant B, ${response.data.data.data.length} products found.`
    );
    return response.data.data.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile(
      "error",
      `Merchant B - Error fetching product list: ${errorMessage}`
    );
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
    logToFile(
      "success",
      `Fetched product list for Merchant C, ${response.data.data.data.length} products found.`
    );
    return response.data.data.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile(
      "error",
      `Merchant C - Error fetching product list: ${errorMessage}`
    );
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
    logToFile(
      "success",
      `Fetched product list for Merchant D, ${response.data.data.data.length} products found.`
    );
    return response.data.data.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile(
      "error",
      `Merchant D - Error fetching product list: ${errorMessage}`
    );
    console.error("merchant:D Error fetching product list:", error.message);
    throw new Error("Failed to fetch product list");
  }
};

const merchantA_FetchAndDeleteCatgory = async (token, merchantId) => {
  try {
    const response = await axios.get(
      `https://api.hyperzod.app/merchant/v1/catalog/product-category/list?merchant_id=${merchantId}`,
      {
        headers: {
          authorization: token,
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );
    if (response.data.data.length > 0) {
      for (let i = 0; i < response.data.data.length; i++) {
        await axios.post(
          `https://api.hyperzod.app/merchant/v1/catalog/product-category/delete`,
          { id: response.data.data[i].category_id, merchant_id: merchantId },
          {
            headers: {
              authorization: token,
              "x-tenant": "onstruct.hyperzod.app",
              "x-client-medium": 3,
            },
          }
        );
      }
      logToFile(
        "success",
        `Successfully fetched and deleted categories for Merchant A.`
      );
    }

    return true;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile(
      "error",
      `Merchant A - Error fetching and deleting categories: ${errorMessage}`
    );
    console.error(
      "merchant:A Error fetching product categories:",
      error.message
    );
    throw new Error("Failed to fetch and delete categories");
  }
};
const merchantB_FetchAndDeleteCatgory = async (token, merchantId) => {
  try {
    const response = await axios.get(
      `https://api.hyperzod.app/merchant/v1/catalog/product-category/list?merchant_id=${merchantId}`,
      {
        headers: {
          authorization: token,
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );
    if (response.data.data.length > 0) {
      for (let i = 0; i < response.data.data.length; i++) {
        await axios.post(
          `https://api.hyperzod.app/merchant/v1/catalog/product-category/delete`,
          { id: response.data.data[i].category_id, merchant_id: merchantId },
          {
            headers: {
              authorization: token,
              "x-tenant": "onstruct.hyperzod.app",
              "x-client-medium": 3,
            },
          }
        );
      }
      logToFile(
        "success",
        `Successfully fetched and deleted categories for Merchant B.`
      );
    }

    return true;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile(
      "error",
      `Merchant B - Error fetching and deleting categories: ${errorMessage}`
    );
    console.error(
      "merchant:B Error fetching product categories:",
      error.message
    );
    throw new Error("Failed to fetch and delete categories");
  }
};
const merchantC_FetchAndDeleteCatgory = async (token, merchantId) => {
  try {
    const response = await axios.get(
      `https://api.hyperzod.app/merchant/v1/catalog/product-category/list?merchant_id=${merchantId}`,
      {
        headers: {
          authorization: token,
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );
    if (response.data.data.length > 0) {
      for (let i = 0; i < response.data.data.length; i++) {
        await axios.post(
          `https://api.hyperzod.app/merchant/v1/catalog/product-category/delete`,
          { id: response.data.data[i].category_id, merchant_id: merchantId },
          {
            headers: {
              authorization: token,
              "x-tenant": "onstruct.hyperzod.app",
              "x-client-medium": 3,
            },
          }
        );
      }
      logToFile(
        "success",
        `Successfully fetched and deleted categories for Merchant C.`
      );
    }

    return true;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile(
      "error",
      `Merchant C - Error fetching and deleting categories: ${errorMessage}`
    );
    console.error(
      "merchant:C Error fetching product categories:",
      error.message
    );
    throw new Error("Failed to fetch and delete categories");
  }
};
const merchantD_FetchAndDeleteCatgory = async (token, merchantId) => {
  try {
    const response = await axios.get(
      `https://api.hyperzod.app/merchant/v1/catalog/product-category/list?merchant_id=${merchantId}`,
      {
        headers: {
          authorization: token,
          "x-tenant": "onstruct.hyperzod.app",
          "x-client-medium": 3,
        },
      }
    );
    if (response.data.data.length > 0) {
      for (let i = 0; i < response.data.data.length; i++) {
        await axios.post(
          `https://api.hyperzod.app/merchant/v1/catalog/product-category/delete`,
          { id: response.data.data[i].category_id, merchant_id: merchantId },
          {
            headers: {
              authorization: token,
              "x-tenant": "onstruct.hyperzod.app",
              "x-client-medium": 3,
            },
          }
        );
      }
      logToFile(
        "success",
        `Successfully fetched and deleted categories for Merchant D.`
      );
    }

    return true;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile(
      "error",
      `Merchant D - Error fetching and deleting categories: ${errorMessage}`
    );
    console.error(
      "merchant:D Error fetching product categories:",
      error.message
    );
    throw new Error("Failed to fetch and delete categories");
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

    logToFile("success", `Merchant A - All products deleted successfully.`);
    return;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile("error", `Merchant A - Error deleting products: ${errorMessage}`);
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

    logToFile("success", `Merchant B - All products deleted successfully.`);
    return;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile("error", `Merchant B - Error deleting products: ${errorMessage}`);
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

    logToFile("success", `Merchant C - All products deleted successfully.`);
    return;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile("error", `Merchant C - Error deleting products: ${errorMessage}`);
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

    logToFile("success", `Merchant D - All products deleted successfully.`);
    return;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    logToFile("error", `Merchant D - Error deleting products: ${errorMessage}`);
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
    const status =
      response?.data?.data?.data.length > 0
        ? response?.data?.data?.data[0]?.import_status
        : "completed";
    logToFile("success", `Merchant A Import Status: ${status}`);
    return status;
  } catch (error) {
    logToFile(
      "error",
      `Merchant A Error checking import status: ${error.message}`
    );
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
    const status =
      response?.data?.data?.data.length > 0
        ? response?.data?.data?.data[0]?.import_status
        : "completed";
    logToFile("success", `Merchant B Import Status: ${status}`);
    return status;
  } catch (error) {
    logToFile(
      "error",
      `Merchant B Error checking import status: ${error.message}`
    );
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
    const status =
      response?.data?.data?.data.length > 0
        ? response?.data?.data?.data[0]?.import_status
        : "completed";
    logToFile("success", `Merchant C Import Status: ${status}`);
    return status;
  } catch (error) {
    logToFile(
      "error",
      `Merchant C Error checking import status: ${error.message}`
    );
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
    const status =
      response?.data?.data?.data.length > 0
        ? response?.data?.data?.data[0]?.import_status
        : "completed";
    logToFile("success", `Merchant D Import Status: ${status}`);
    return status;
  } catch (error) {
    logToFile(
      "error",
      `Merchant D Error checking import status: ${error.message}`
    );
    console.error("merchant:D Error checking import status:", error);
    throw error;
  }
};

// upload csv
const merchantA_HyperzodUpload = async (token, filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
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
    logToFile("success", "Merchant A file uploaded successfully");
    return response.data;
  } catch (error) {
    logToFile("error", `Merchant A Error uploading file: ${error.message}`);
    console.error("merchant:A Error uploading file:", error.message);
    throw new Error("File upload failed");
  }
};
const merchantB_HyperzodUpload = async (token, filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
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
    logToFile("success", "Merchant B file uploaded successfully");
    return response.data;
  } catch (error) {
    logToFile("error", `Merchant B Error uploading file: ${error.message}`);
    console.error("merchant:B Error uploading file:", error.message);
    throw new Error("File upload failed");
  }
};
const merchantC_HyperzodUpload = async (token, filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
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
    logToFile("success", "Merchant C file uploaded successfully");
    return response.data;
  } catch (error) {
    logToFile("error", `Merchant C Error uploading file: ${error.message}`);
    console.error("merchant:C Error uploading file:", error.message);
    throw new Error("File upload failed");
  }
};
const merchantD_HyperzodUpload = async (token, filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
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
    logToFile("success", "Merchant D file uploaded successfully");
    return response.data;
  } catch (error) {
    logToFile("error", `Merchant D Error uploading file: ${error.message}`);
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
    logToFile(
      "success",
      `Merchant A product import validated successfully for merchantId: ${merchantId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.data.message === "An import is already processing.") {
      await merchantA_ValidateProductImport(data, token, merchantId);
    }
    logToFile(
      "error",
      `Merchant A Error in product import validation: ${error.response.data.message}`
    );
    console.log(
      "merchant:A Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
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
    logToFile(
      "success",
      `Merchant B product import validated successfully for merchantId: ${merchantId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.data.message === "An import is already processing.") {
      await merchantB_ValidateProductImport(data, token, merchantId);
    }
    logToFile(
      "error",
      `Merchant B Error in product import validation: ${error.response.data.message}`
    );
    console.log(
      "merchant:B Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
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
    logToFile(
      "success",
      `Merchant C product import validated successfully for merchantId: ${merchantId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.data.message === "An import is already processing.") {
      await merchantC_ValidateProductImport(data, token, merchantId);
    }
    logToFile(
      "error",
      `Merchant C Error in product import validation: ${error.response.data.message}`
    );
    console.log(
      "merchant:C Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
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
    logToFile(
      "success",
      `Merchant D product import validated successfully for merchantId: ${merchantId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.data.message === "An import is already processing.") {
      await merchantD_ValidateProductImport(data, token, merchantId);
    }
    logToFile(
      "error",
      `Merchant D Error in product import validation: ${error.response.data.message}`
    );
    console.log(
      "merchant:D Error in product import validation Hyperzod: :>> ",
      error.response.data.message
    );
    return error.message;
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
    logToFile(
      "success",
      `Merchant A product import successful for importId: ${data.import_id}`
    );
    return response.data;
  } catch (error) {
    logToFile("error", `Merchant A Error in product import: ${error.message}`);
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
    logToFile(
      "success",
      `Merchant B product import successful for importId: ${data.import_id}`
    );
    return response.data;
  } catch (error) {
    logToFile("error", `Merchant B Error in product import: ${error.message}`);
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
    logToFile(
      "success",
      `Merchant C product import successful for importId: ${data.import_id}`
    );
    return response.data;
  } catch (error) {
    logToFile("error", `Merchant C Error in product import: ${error.message}`);
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
    logToFile(
      "success",
      `Merchant D product import successful for importId: ${data.import_id}`
    );
    return response.data;
  } catch (error) {
    logToFile("error", `Merchant D Error in product import: ${error.message}`);
    console.error("merchant:D Error in product import:", error.message);
    throw new Error("Product import failed");
  }
};

// = = = = Update product API's = = = = //
const searchProducts = async (sku, branchIds) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://www.travisperkins.co.uk/federation-graphql?op=tpplcProductBySKU",
      data: {
        operationName: "tpplcProductBySKU",
        variables: {
          productSku: sku,
          salesChannel: "ECOMMERCE",
          brandId: "tp",
        },
        query:
          "query tpplcProductBySKU($salesChannel: TpplcSalesChannel!, $brandId: ID!, $productSku: String!) {\n  tpplcBrand(brandId: $brandId) {\n    tpplcProductBySku(productSku: $productSku, salesChannel: $salesChannel) {\n      ...TPPLCProductFields\n }\n  }\n}\n\nfragment TPPLCProductFields on TpplcProduct {\n  id\n  sku\n  name}",
      },
    });

    const getProQty = await getProductsQty(
      response.data.data.tpplcBrand.tpplcProductBySku.id,
      branchIds
    );

    return getProQty;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const getProductsQty = async (productIds, branchIds) => {
  try {
    let qtyData = {
      operationName: "stockTpplc",
      variables: {
        branchIds: branchIds,
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
    const getProductsQty = qtyResponse.data.data.tpplcStock.stock.map(
      (stockItem) => stockItem.quantity
    );
    return getProductsQty;
  } catch (error) {
    console.log("error :>> ", error);
  }
};

const updateProduct = async (payload, token) => {
  try {
    const url =
      "https://api.hyperzod.app/merchant/v1/catalog/product/stock/updateCountBulk";
    const headers = {
      authorization: token,
      "x-tenant": "onstruct.hyperzod.app",
    };
    const response = await axios.post(url, payload, { headers });
    console.log("response.data.success :>> ", response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
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

  merchantA_FetchAndDeleteCatgory,
  merchantB_FetchAndDeleteCatgory,
  merchantC_FetchAndDeleteCatgory,
  merchantD_FetchAndDeleteCatgory,

  searchProducts,
  updateProduct,
};
