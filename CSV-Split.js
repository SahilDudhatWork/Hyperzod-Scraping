const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const inputFilePath = path.resolve("C:/Projects/Hyperzod-Scraping/CSV/CSV_WITH_IMG.csv");

const CHUNK_SIZE = 500;

// 🧱 Reference Headers (only these will be included)
const referenceHeaders = [
  "PRODUCT.CATEGORY",
  "PRODUCT.NAME",
  "PRODUCT.DESCRIPTION",
  "PRODUCT.SKU",
  "PRODUCT.PRICE.SELLING",
  "PRODUCT.TAX_PERCENT",
  "PRODUCT.PRICE.COST",
  "PRODUCT.INVENTORY",
  "PRODUCT.MIN.MAX.QUANTITY",
  "PRODUCT.IMAGES",
  "PRODUCT.ID",
  "PRODUCT.PRICE.COMPARE",
  "PRODUCT.STATUS",
  "PRODUCT.TAGS",
  "PRODUCT.LABELS"
];

const results = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    const transformedData = results.map((row, index) => {
      return {
        "PRODUCT.CATEGORY": row["Item Catagory"]?.trim() || "Other",
        "PRODUCT.NAME": row["Item Name"] || "",
        "PRODUCT.DESCRIPTION": row["Item Description"] || "",
        "PRODUCT.SKU": `SKU-${String(index + 1).padStart(5, "0")}`,
        "PRODUCT.PRICE.SELLING": parseFloat(row["Sell"]) || 0,
        "PRODUCT.TAX_PERCENT": 0,
        "PRODUCT.PRICE.COST": 0,
        "PRODUCT.INVENTORY": 0,
        "PRODUCT.MIN.MAX.QUANTITY": "1,50",
        "PRODUCT.IMAGES": row["Image URL"] || "",
        "PRODUCT.ID": "",
        "PRODUCT.PRICE.COMPARE": 0,
        "PRODUCT.STATUS": "ACTIVE",
        "PRODUCT.TAGS": "",
        "PRODUCT.LABELS": ""
      };
    });

    const totalChunks = Math.ceil(transformedData.length / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = transformedData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

      const writer = createCsvWriter({
        path: `CSV/output-${i + 1}.csv`,
        header: referenceHeaders.map((key) => ({ id: key, title: key })),
      });

      writer.writeRecords(chunk).then(() =>
        console.log(`✅ Saved output-${i + 1}.csv (${chunk.length} rows)`));
    }
  });
