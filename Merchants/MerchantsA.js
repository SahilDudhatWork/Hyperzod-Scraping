const {
  loginUser,
  merchantA_GetProductList,
  merchantA_BulkDeleteProduct,
  merchantA_HyperzodUpload,
  merchantA_ValidateProductImport,
  merchantA_ImportProductData,
  merchantA_CheckImportStatus,
} = require("../hyperzodAPI");
const fs = require("fs");
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
    const filePath = `./temp_chunk_A_${chunkIndex}.csv`;

    fs.writeFile(filePath, csvData, (err) => {
      if (err) return reject(err);
      resolve(filePath);
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
      const uploadResult = await merchantA_HyperzodUpload(token, tempFilePath);
      if (!uploadResult || uploadResult.status_code !== 200) {
        throw new Error(`Failed to upload chunk ${chunkIndex + 1}`);
      }

      // Validate the uploaded chunk
      const validationResult = await merchantA_ValidateProductImport(
        uploadResult.data,
        token,
        merchantId
      );
      if (!validationResult || validationResult.status_code !== 200) {
        throw new Error(`Validation failed for chunk ${chunkIndex + 1}`);
      }

      // Import the validated products
      const importResult = await merchantA_ImportProductData(
        validationResult.data,
        token,
        merchantId
      );
      if (!importResult || importResult.status_code !== 200) {
        throw new Error(`Import failed for chunk ${chunkIndex + 1}`);
      }

      console.log(
        `merchant-A: Chunk ${chunkIndex + 1} import successful:`,
        importResult.message
      );

      // Remove the temporary CSV file after successful import
      fs.unlinkSync(tempFilePath);

      // Mark as successful
      success = true;
    } catch (error) {
      retryCount++;
      console.error(
        `merchant-A: Error processing chunk ${
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
    status = await merchantA_CheckImportStatus(token, merchantId);
    console.log(`merchant-A: Current import status: ${status}`);
    if (status === "completed") break;

    await sleep(30000); // Check every 30 sec
  } while (status !== "completed");
}

// Main function to handle the CSV upload in chunks with delay
const MerchantsA = async () => {
  try {
    const token = `Bearer ${await loginUser()}`;
    const merchantId = "66f544b605f843b99b0fbff3";
    const page = 1;
    const pageLimit = 300;

    // Step 1: Loop until there are no more products to delete
    while (true) {
      // Fetch the product list for the current page
      const getProductListResult = await merchantA_GetProductList(
        page,
        pageLimit,
        token,
        merchantId
      );

      // If there are no more products to delete, break the loop
      if (getProductListResult.length === 0) {
        console.log("merchant-A: NO Products for delete.");
        break;
      }

      // Delete the fetched products
      await merchantA_BulkDeleteProduct(
        getProductListResult,
        token,
        merchantId
      );

      // Log progress
      console.log(
        `merchant-A: Deleted ${getProductListResult.length} products from page ${page}.`
      );
    }

    // Step 2: Read CSV and split data into chunks of 500 rows
    const { data: csvData, headers } = await readCSV("./BranchA.csv");
    const chunks = chunkArray(csvData, 250);

    // Step 3: Process each chunk individually with retry on failure and 5 min delay between successful chunks
    for (let i = 0; i < chunks.length; i++) {
      console.log(`merchant-A: Processing chunk ${i + 1} of ${chunks.length}`);
      console.log("merchant-A: chunks data length-->", chunks[i].length);
      // Process the chunk with retry logic
      await processChunkWithRetry(chunks[i], i, headers, token, merchantId);
      await waitForCompletion(token, merchantId);
      console.log(
        `merchant-A: Chunk ${i + 1} completed. Moving to next chunk.`
      );
    }

    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31m MerchantsA - All chunks processed successfully.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error in CSV import process:", error.message);
  }
};
module.exports = MerchantsA;
