const {
  loginUser,
  merchantC_GetProductList,
  merchantC_BulkDeleteProduct,
  merchantC_HyperzodUpload,
  merchantC_ValidateProductImport,
  merchantC_ImportProductData,
  merchantC_CheckImportStatus,
  merchantC_FetchAndDeleteCatgory,
} = require("../hyperzodAPI");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Parser } = require("json2csv");

// Function to chunk array into smaller arrays of size 500
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Read CSV and convert it into JSON, preserving empty columns
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const headers = [];

    fs.createReadStream(filePath)
      .pipe(csv({ skipEmptyLines: false }))
      .on("headers", (headerList) => {
        headers.push(...headerList);
      })
      .on("data", (data) => results.push(data))
      .on("end", () => resolve({ data: results, headers }))
      .on("error", (error) => reject(error));
  });
}

// Function to write chunk to a temporary CSV file, preserving empty columns
function writeChunkToCSV(chunk, chunkIndex, headers) {
  return new Promise((resolve, reject) => {
    const json2csvParser = new Parser({ fields: headers });
    const csvData = json2csvParser.parse(chunk);
    const filePath = path.join(
      __dirname,
      `../../Temp/temp_chunk_C_${chunkIndex}.csv`
    );

    fs.writeFile(filePath, csvData, (err) => {
      if (err) return reject(err);
      resolve(filePath); // Return the file path for the chunk
    });
  });
}

// Sleep function to introduce a delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry logic wrapper for each chunk
async function processChunkWithRetry(
  chunk,
  chunkIndex,
  headers,
  token,
  merchantId
) {
  let success = false;
  let retryCount = 0;

  while (!success) {
    try {
      // Write the chunk to a temporary CSV file, preserving headers
      const tempFilePath = await writeChunkToCSV(chunk, chunkIndex, headers);

      // Upload the temporary CSV file
      const uploadResult = await merchantC_HyperzodUpload(token, tempFilePath);
      if (!uploadResult || uploadResult.status_code !== 200) {
        throw new Error(`Failed to upload chunk ${chunkIndex + 1}`);
      }

      // Validate the uploaded chunk
      const validationResult = await merchantC_ValidateProductImport(
        uploadResult.data,
        token,
        merchantId
      );
      if (!validationResult || validationResult.status_code !== 200) {
        throw new Error(`Validation failed for chunk ${chunkIndex + 1}`);
      }

      // Import the validated products
      const importResult = await merchantC_ImportProductData(
        validationResult.data,
        token,
        merchantId
      );
      if (!importResult || importResult.status_code !== 200) {
        throw new Error(`Import failed for chunk ${chunkIndex + 1}`);
      }

      console.log(
        `merchant-C: Chunk ${chunkIndex + 1} import successful:`,
        importResult.message
      );

      // Remove the temporary CSV file after successful import
      fs.unlinkSync(tempFilePath);

      // Mark as successful
      success = true;
    } catch (error) {
      retryCount++;
      console.error(
        `merchant-C: Error processing chunk ${
          chunkIndex + 1
        }, retrying in 1 Minit (Attempt ${retryCount})...`,
        error.message
      );
      await sleep(60000); // Wait for 1 Minit before retrying
    }
  }
}
async function waitForCompletion(token, merchantId) {
  let status;
  do {
    status = await merchantC_CheckImportStatus(token, merchantId);
    console.log(`merchant-C: Current import status: ${status}`);
    if (status !== "processing") break;

    await sleep(30000); // Check every 30 sec
  } while (status !== "completed");
}
// Main function to handle the CSV upload in chunks with delay
const MerchantsC = async () => {
  try {
    const token = `Bearer ${await loginUser()}`;
    const merchantId = "66f67a9863e7cad5c0021c91";
    const page = 1;
    const pageLimit = 300;

    // Step 1: Fetch and delete existing products
    while (true) {
      // Fetch the product list for the current page
      const getProductListResult = await merchantC_GetProductList(
        page,
        pageLimit,
        token,
        merchantId
      );

      // If there are no more products to delete, break the loop
      if (getProductListResult.length === 0) {
        console.log("merchant-C: NO Products for delete.");
        break;
      }

      // Delete the fetched products
      await merchantC_BulkDeleteProduct(
        getProductListResult,
        token,
        merchantId
      );

      // Log progress
      console.log(
        `merchant-C: Deleted ${getProductListResult.length} products from page ${page}.`
      );
    }
    await merchantC_FetchAndDeleteCatgory(token, merchantId);
    console.log(`merchant-C: Deleted all categories.`);

    // Step 2: Read CSV and split data into chunks of 500 rows
    const { data: csvData, headers } = await readCSV("./Temp/BranchC.csv");
    const chunks = chunkArray(csvData, 250);

    // Step 3: Process each chunk individually with retry on failure and 5 min delay between successful chunks
    for (let i = 0; i < chunks.length; i++) {
      console.log(`merchant-C: Processing chunk ${i + 1} of ${chunks.length}`);
      console.log("merchant-C: chunks data length-->", chunks[i].length);
      // Process the chunk with retry logic
      await processChunkWithRetry(chunks[i], i, headers, token, merchantId);
      await waitForCompletion(token, merchantId);
      console.log(
        `merchant-C: Chunk ${i + 1} completed. Moving to next chunk.`
      );
    }

    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31m MerchantsC - All chunks processed successfully.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error in CSV import process:", error.message);
  }
};

module.exports = MerchantsC;
