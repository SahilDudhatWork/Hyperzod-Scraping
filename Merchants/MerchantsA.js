const {
  loginUser,
  getProductList,
  bulkDeleteProducts,
  hyperzodUpload,
  validateProductImport,
  importProductData,
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
    const filePath = `./temp_chunk_${chunkIndex}.csv`;

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
      const uploadResult = await hyperzodUpload(token, tempFilePath);
      if (!uploadResult || uploadResult.status_code !== 200) {
        throw new Error(`Failed to upload chunk ${chunkIndex + 1}`);
      }

      // Validate the uploaded chunk
      const validationResult = await validateProductImport(
        uploadResult.data,
        token,
        merchantId
      );
      if (!validationResult || validationResult.status_code !== 200) {
        throw new Error(`Validation failed for chunk ${chunkIndex + 1}`);
      }

      // Import the validated products
      const importResult = await importProductData(
        validationResult.data,
        token,
        merchantId
      );
      if (!importResult || importResult.status_code !== 200) {
        throw new Error(`Import failed for chunk ${chunkIndex + 1}`);
      }

      console.log(
        `Chunk ${chunkIndex + 1} import successful:`,
        importResult.message
      );

      // Remove the temporary CSV file after successful import
      fs.unlinkSync(tempFilePath);

      // Mark as successful
      success = true;
    } catch (error) {
      retryCount++;
      console.error(
        `Error processing chunk ${
          chunkIndex + 1
        }, retrying in 1 Minit (Attempt ${retryCount})...`,
        error.message
      );
      await sleep(60000); // Wait for 1 Minit before retrying
    }
  }
}

// Main function to handle the CSV upload in chunks with delay
const MerchantsA = async () => {
  try {
    const token = `Bearer ${await loginUser()}`;
    const merchantId = "66f544b605f843b99b0fbff3";
    const page = 1;
    const pageLimit = 300;

    // // Step 1: Fetch and delete existing products
    // const getProductListResult = await getProductList(
    //   page,
    //   pageLimit,
    //   token,
    //   merchantId
    // );
    // if (getProductListResult.length > 0) {
    //   await bulkDeleteProducts(getProductListResult, token, merchantId);
    // }

    // Step 1: Loop until there are no more products to delete
    while (true) {
      // Fetch the product list for the current page
      const getProductListResult = await getProductList(
        page,
        pageLimit,
        token,
        merchantId
      );

      // If there are no more products to delete, break the loop
      if (getProductListResult.length === 0) {
        console.log("NO Products.");
        break;
      }

      // Delete the fetched products
      await bulkDeleteProducts(getProductListResult, token, merchantId);

      // Log progress
      console.log(
        `merchantId:${merchantId} -- Deleted ${getProductListResult.length} products from page ${page}.`
      );

      // Move to the next page
      // page++;
    }

    // Step 2: Read CSV and split data into chunks of 500 rows
    const { data: csvData, headers } = await readCSV("./BranchA.csv");
    const chunks = chunkArray(csvData, 250);

    // Step 3: Process each chunk individually with retry on failure and 5 min delay between successful chunks
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1} of ${chunks.length}`);
      console.log("chunks data length-->", chunks[i].length);
      // Process the chunk with retry logic
      await processChunkWithRetry(chunks[i], i, headers, token, merchantId);

      // Introduce a fixed 5-minute delay (300000 milliseconds) after successful chunk import
      if (chunks[i].length >= 200) {
        const delay = 240000;
        console.log(`Waiting for 4 minutes before uploading the next chunk...`);
        await sleep(delay); // Wait before uploading the next chunk
      } else if (chunks[i].length < 200 && chunks[i].length >= 100) {
        const delay = 120000;
        console.log(`Waiting for 2 minutes before uploading the next chunk...`);
        await sleep(delay); // Wait before uploading the next chunk
      } else {
        const delay = 30000;
        console.log(
          `Waiting for 30 seconds before uploading the next chunk...`
        );
        await sleep(delay); // Wait before uploading the next chunk
      }
    }

    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31m MerchantsA - All chunks processed successfully.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error in CSV import process:", error.message);
  }
};

module.exports = MerchantsA;
