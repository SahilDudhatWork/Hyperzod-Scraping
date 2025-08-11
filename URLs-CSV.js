// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// // === CONFIG ===
// const CSV_INPUT = path.resolve("C:/Users/01/Downloads/AS - categoried excel spreadsheet(Worksheet).csv");
// const JSON_DIR = path.resolve('C:/Projects/Hyperzod-Scraping/products');
// const CSV_OUTPUT = path.resolve('C:/Projects/Hyperzod-Scraping/products/AS-categorised-with-images.csv');


// // === Step 1: Load all JSON files
// function loadAllJsonData(dir) {
//   const files = fs.readdirSync(dir).filter(f => f.startsWith('product_') && f.endsWith('.json'));
//   const allData = [];

//   for (const file of files) {
//     const fullPath = path.join(dir, file);
//     const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
//     allData.push(...content);
//   }

//   return allData;
// }

// // // Normalize function to match names robustly
// function normalize(str) {
//   return (str || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
// }

// // === Load image data from all JSON files
// const jsonData = loadAllJsonData(JSON_DIR);
// const imageMap = new Map();
// jsonData.forEach(item => {
//   const key = normalize(item.name);
//   if (!imageMap.has(key)) {
//     imageMap.set(key, item.image);
//   }
// });

// // === Step 2: Read CSV and merge
// const rows = [];

// fs.createReadStream(CSV_INPUT)
//   .pipe(csv())
//   .on('data', (row) => {
//     const key = normalize(row['Product/Service Name']);
//     const imageUrl = imageMap.get(key) || 'Not found';
//     row['Image URL'] = imageUrl;
//     rows.push(row);
//   })
//   .on('end', () => {
//     const headers = Object.keys(rows[0]).map(h => ({ id: h, title: h }));

//     const outputDir = path.dirname(CSV_OUTPUT);
//     fs.mkdirSync(outputDir, { recursive: true });

//     const csvWriter = createCsvWriter({
//       path: CSV_OUTPUT,
//       header: headers
//     });

//     csvWriter.writeRecords(rows).then(() => {
//       console.log('✅ CSV file updated with image URLs:', CSV_OUTPUT);
//     });
//   });













const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// === CONFIG ===
// const CSV_INPUT = path.resolve("C:/Users/01/Downloads/AS - categoried excel spreadsheet(Worksheet).csv");
// const JSON_DIR = path.resolve('C:/Projects/Hyperzod-Scraping/products');
// const COMBINED_JSON = path.resolve(JSON_DIR, 'all-products-combined.json');
// const CSV_OUTPUT = path.resolve('C:/Projects/Hyperzod-Scraping/products/AS-categorised-with-images.csv');
const CSV_INPUT = path.resolve('C:/Projects/Hyperzod-Scraping/CSV/merged_CSV.csv');
const JSON_DIR = path.resolve('C:/Projects/Hyperzod-Scraping/products');
const COMBINED_JSON = path.resolve(JSON_DIR, 'all-products-combined.json');
const CSV_OUTPUT = path.resolve('C:/Projects/Hyperzod-Scraping/CSV/CSV_WITH_IMG.csv');

// Normalize function for fuzzy matching
function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/gi, '');
}

// Step 1: Load and combine all JSON files into one JSON file
function loadAndCombineJson(dir) {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('product_') && f.endsWith('.json'));
  const allData = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      if (Array.isArray(content)) {
        allData.push(...content);
      }
    } catch (err) {
      console.error(`❌ Error parsing ${file}: ${err.message}`);
    }
  }

  fs.writeFileSync(COMBINED_JSON, JSON.stringify(allData, null, 2), 'utf-8');
  console.log(`✅ Combined ${files.length} JSON files into:`, COMBINED_JSON);
  return allData;
}

// Step 2: Create image lookup map using fuzzy matching
function buildImageMap(data) {
  const map = new Map();
  data.forEach(item => {
    const norm = normalize(item.name);
    if (norm && !map.has(norm)) {
      map.set(norm, item.image || '');
    }
  });
  return map;
}

// Step 3: Read CSV and append image URLs
function enrichCsvWithImages(imageMap) {
  const rows = [];

  fs.createReadStream(CSV_INPUT, { encoding: 'utf-8' })
    .pipe(csv())
    .on('data', (row) => {
      const name = row['Item Name'];
      const normalizedCsvName = normalize(name);
      let matchedImage = '';

      for (let [jsonNormName, img] of imageMap.entries()) {
        if (normalizedCsvName.includes(jsonNormName)) {
          matchedImage = img;
          break;
        }
      }

      row['Image URL'] = matchedImage;
      rows.push(row);
    })
    .on('end', () => {
      if (!rows.length) {
        console.warn('⚠️ No rows found in CSV.');
        return;
      }

      const headers = Object.keys(rows[0]).map(k => ({ id: k, title: k }));

      const csvWriter = createCsvWriter({
        path: CSV_OUTPUT,
        header: headers
      });

      csvWriter.writeRecords(rows)
        .then(() => console.log('✅ CSV file written with image URLs:', CSV_OUTPUT))
        .catch(err => console.error('❌ Error writing CSV:', err));
    });
}

// === EXECUTION FLOW ===
const combinedJson = loadAndCombineJson(JSON_DIR);
const imageMap = buildImageMap(combinedJson);
enrichCsvWithImages(imageMap);






















// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');

// // === CONFIG ===
// const CSV_INPUT = path.resolve("C:/Users/01/Downloads/AS - categoried excel spreadsheet(Worksheet).csv");
// const JSON_OUTPUT = path.resolve("C:/Projects/Hyperzod-Scraping/products/category-name-list.json");

// const result = [];
// let index = 0
// fs.createReadStream(CSV_INPUT)
//   .pipe(csv())
//   .on('data', (row) => {
//     index++;
//     const category = row['Category']?.trim(); // access the first unnamed column
//     const name = row['Product/Service Name']?.trim();


//     result.push({ category, name });
    
//     console.log('index :>> ', index);
//   })
//   .on('end', () => {
//     fs.writeFileSync(JSON_OUTPUT, JSON.stringify(result, null, 2), 'utf-8');
//     console.log(`✅ Extracted ${result.length} records to: ${JSON_OUTPUT}`);
//   })
//   .on('error', (err) => {
//     console.error("❌ Error reading CSV:", err.message);
//   });










// const fs = require('fs');
// const path = require('path');
// const cheerio = require('cheerio');

// // Input/output file paths
// const inputHtmlPath = path.join(__dirname, 'product_cards', 'product_cards-2_1.html');
// const outputJsonPath = path.join(__dirname, 'product_cards', 'product_data-2_1.json');

// // Read HTML file
// const htmlContent = fs.readFileSync(inputHtmlPath, 'utf-8');

// // Load HTML into Cheerio
// const $ = cheerio.load(htmlContent);

// // Extract product cards
// const products = [];

// $('.product-card').each((i, el) => {
//   const name = $(el).find('.product-name').text().trim();
//   const category = $(el).find('.product-category').text().trim();
//   const image = $(el).find('img').attr('src') || '';

//   products.push({ category, name, image });
// });

// // Write JSON output
// fs.writeFileSync(outputJsonPath, JSON.stringify(products, null, 2), 'utf-8');

// console.log(`✅ Extracted ${products.length} products to ${outputJsonPath}`);

