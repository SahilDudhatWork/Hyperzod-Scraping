//?===============================================================
//!---------------- Base64 to URL Conversion 
//?===============================================================


const fs = require('fs').promises;
const path = require('path');
const ftp = require('ftp');

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-]/gi, '-');
}

async function convertBase64ToUrlWithHostinger() {
  const OUTPUT_DIR = 'C:\\Projects\\Hyperzod-Scraping\\product_cards'; // Source JSON directory
  const OUTPUT_DIR2 = 'C:\\Projects\\Hyperzod-Scraping\\products';     // Output JSON directory

  const baseFilePattern = 'product_data-2_';
  const convertedFilePattern = 'product_';

  const HOSTINGER_HOST = 'ftp.sahildudhat.com';
  const HOSTINGER_USER = 'u121802690.HYP1212';
  const HOSTINGER_PASSWORD = '2Ya6ZIT53jv@=I0';

  // const HOSTINGER_PUBLIC_URL = 'https://srv1192-files.hstgr.io/24ebd5cd5c72d649/files/public_html/hyp-images/';
  const HOSTINGER_PUBLIC_URL = 'https://sahildudhat.com/hyp-images/';


  await fs.mkdir(OUTPUT_DIR2, { recursive: true });

  const files = (await fs.readdir(OUTPUT_DIR))
    .filter(file => file.startsWith(baseFilePattern) && file.endsWith('.json'))
    .sort((a, b) => {
      const numA = parseInt(a.split('_')[2].split('.')[0]);
      const numB = parseInt(b.split('_')[2].split('.')[0]);
      return numA - numB;
    });

  const ftpClient = new ftp();

  await new Promise((resolve, reject) => {
    ftpClient.connect({
      host: HOSTINGER_HOST,
      user: HOSTINGER_USER,
      password: HOSTINGER_PASSWORD,
      secure: false
    });
    ftpClient.on('ready', resolve);
    ftpClient.on('error', reject);
  });

  for (const file of files) {
    const batchNumber = parseInt(file.split('_')[2].split('.')[0]);
    const inputFile = path.join(OUTPUT_DIR, file);
    const outputFile = path.join(OUTPUT_DIR2, `${convertedFilePattern}${batchNumber}.json`);

    try {
      const data = JSON.parse(await fs.readFile(inputFile, 'utf8'));

      const updatedData = await Promise.all(data.map(async (product) => {
        if (product.image && product.image.startsWith('data:image/')) {
          try {
            const base64Data = product.image.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            const randomSuffix = Math.floor(Math.random() * 1000);
            const safeName = sanitizeFilename(product.name);
            const filename = `${safeName}_${Date.now()}_${randomSuffix}.jpg`;

            // Upload into current directory
            await new Promise((resolve, reject) => {
              ftpClient.put(buffer, filename, (err) => {
                if (err) {
                  console.error(`❌ FTP upload failed for ${filename}:`, err.message);
                  reject(err);
                } else {
                  resolve();
                }
              });
            });

            const imageUrl = `${HOSTINGER_PUBLIC_URL}${filename}`;
            return { ...product, image: imageUrl };

          } catch (err) {
            console.error(`❌ Failed to process image for ${product.name}:`, err.message);
            return { ...product, image: 'Not found due to decode/upload error' };
          }
        }
        return product;
      }));

      await fs.writeFile(outputFile, JSON.stringify(updatedData, null, 2));
      console.log(`✅ Converted ${inputFile} to ${outputFile}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Close FTP connection
  await new Promise((resolve) => ftpClient.end(resolve));
}

convertBase64ToUrlWithHostinger().catch(console.error);








//?===============================================================
//!---------------- Url to Base64 Conversion 
//?===============================================================






// const fs = require('fs').promises;
// const path = require('path');
// const ftp = require('ftp');

// function sanitizeFilename(name) {
//   return name.replace(/[^a-z0-9_\-]/gi, '-');
// }

// async function convertBase64ToUrlWithHostinger() {
//   const OUTPUT_DIR = 'C:\\Projects\\Hyperzod-Scraping\\product_cards'; // Source JSON directory
//   const OUTPUT_DIR2 = 'C:\\Projects\\Hyperzod-Scraping\\products';     // Output JSON directory

//   const baseFilePattern = 'product_data-2_';
//   const convertedFilePattern = 'product_';

//   const HOSTINGER_HOST = 'ftp.sahildudhat.com';
//   const HOSTINGER_USER = 'u121802690.HYP1212';
//   const HOSTINGER_PASSWORD = '2Ya6ZIT53jv@=I0';
//   const HOSTINGER_PUBLIC_URL = 'https://sahildudhat.com/hyp-images/';

//   await fs.mkdir(OUTPUT_DIR2, { recursive: true });

//   const files = (await fs.readdir(OUTPUT_DIR))
//     .filter(file => file.startsWith(baseFilePattern) && file.endsWith('.json'))
//     .sort((a, b) => {
//       const numA = parseInt(a.split('_')[2].split('.')[0]);
//       const numB = parseInt(b.split('_')[2].split('.')[0]);
//       return numA - numB;
//     });

//   const ftpClient = new ftp();

//   await new Promise((resolve, reject) => {
//     ftpClient.connect({
//       host: HOSTINGER_HOST,
//       user: HOSTINGER_USER,
//       password: HOSTINGER_PASSWORD,
//       secure: false,
//     });
//     ftpClient.on('ready', resolve);
//     ftpClient.on('error', reject);
//   });

//   for (const file of files) {
//     const batchNumber = parseInt(file.split('_')[2].split('.')[0]);
//     const inputFile = path.join(OUTPUT_DIR, file);
//     const outputFile = path.join(OUTPUT_DIR2, `${convertedFilePattern}${batchNumber}.json`);

//     try {
//       const data = JSON.parse(await fs.readFile(inputFile, 'utf8'));

//       const updatedData = await Promise.all(data.map(async (product) => {
//         if (!product.image || product.image === 'Not found' || 
//             product.image === 'Not found due to decode/upload error' || 
//             product.image === 'Not found due to repeated errors or bot detection') {
//           return { ...product, image: 'Not found' };
//         }

//         try {
//           if (product.image.startsWith('data:image/')) {
//             // Handle base64 images
//             const randomSuffix = Math.floor(Math.random() * 1000);
//             const safeName = sanitizeFilename(product.name);
//             const filename = `${safeName}_${Date.now()}_${randomSuffix}.jpg`;
//             const base64Data = product.image.split(',')[1];
//             const buffer = Buffer.from(base64Data, 'base64');

// // Upload to Hostinger FTP
// await new Promise((resolve, reject) => {
//   ftpClient.put(buffer, filename, (err) => {
//     if (err) {
//       console.error(`❌ FTP upload failed for ${filename}:`, err.message);
//       reject(err);
//     } else {
//       resolve();
//     }
//   });
// });

//             return { ...product, image: `${HOSTINGER_PUBLIC_URL}${filename}` };
//           } else if (product.image.startsWith('http')) {
// Keep URL-based images as is
// return { ...product };
//           } else {
//             throw new Error('Invalid image format');
//           }
//         } catch (err) {
//           console.error(`❌ Failed to process image for ${product.name}:`, err.message);
//           return { ...product, image: 'Not found due to decode/upload error' };
//         }
//       }));

// await fs.writeFile(outputFile, JSON.stringify(updatedData, null, 2));
//       console.log(`✅ Converted ${inputFile} to ${outputFile}`);
//     } catch (error) {
//       console.error(`❌ Error processing ${file}:`, error.message);
//     }
//   }

//   // Close FTP connection/
//   // await new Promise((resolve) => ftpClient.end(resolve));/
// }

// convertBase64ToUrlWithHostinger().catch(console.error);






//?===============================================================
//!---------------- Url to Base64 Conversion
//?===============================================================



// const fs = require('fs').promises;
// const path = require('path');
// const ftp = require('ftp');
// const axios = require('axios');

// function sanitizeFilename(name) {
//   return name.replace(/[^a-z0-9_\-]/gi, '-');
// }

// async function convertBase64ToUrlWithHostinger() {
//   const OUTPUT_DIR = 'C:\\Projects\\Hyperzod-Scraping\\product_cards'; // Source JSON directory
//   const OUTPUT_DIR2 = 'C:\\Projects\\Hyperzod-Scraping\\products';     // Output JSON directory

//   const baseFilePattern = 'product_data-2_';
//   const convertedFilePattern = 'product_';

//   const HOSTINGER_HOST = 'ftp.sahildudhat.com';
//   const HOSTINGER_USER = 'u121802690.HYP1212';
//   const HOSTINGER_PASSWORD = '2Ya6ZIT53jv@=I0';
//   const HOSTINGER_PUBLIC_URL = 'https://sahildudhat.com/hyp-images/';

//   await fs.mkdir(OUTPUT_DIR2, { recursive: true });

//   const files = (await fs.readdir(OUTPUT_DIR))
//     .filter(file => file.startsWith(baseFilePattern) && file.endsWith('.json'))
//     .sort((a, b) => {
//       const numA = parseInt(a.split('_')[2].split('.')[0]);
//       const numB = parseInt(b.split('_')[2].split('.')[0]);
//       return numA - numB;
//     });

//   const ftpClient = new ftp();

//   await new Promise((resolve, reject) => {
//     ftpClient.connect({
//       host: HOSTINGER_HOST,
//       user: HOSTINGER_USER,
//       password: HOSTINGER_PASSWORD,
//       secure: false,
//     });
//     ftpClient.on('ready', resolve);
//     ftpClient.on('error', reject);
//   });

//   for (const file of files) {
//     const batchNumber = parseInt(file.split('_')[2].split('.')[0]);
//     const inputFile = path.join(OUTPUT_DIR, file);
//     const outputFile = path.join(OUTPUT_DIR2, `${convertedFilePattern}${batchNumber}.json`);

//     try {
//       const data = JSON.parse(await fs.readFile(inputFile, 'utf8'));

//       const updatedData = await Promise.all(data.map(async (product) => {
//         if (!product.image || product.image === 'Not found' ||
//           product.image === 'Not found due to decode/upload error' ||
//           product.image === 'Not found due to repeated errors or bot detection') {
//           return { ...product, image: 'Not found' };
//         }

//         try {
//           if (product.image.startsWith('data:image/')) {
//             // Handle base64 images
//             const randomSuffix = Math.floor(Math.random() * 1000);
//             const safeName = sanitizeFilename(product.name);
//             const filename = `${safeName}_${Date.now()}_${randomSuffix}.jpg`;
//             const base64Data = product.image.split(',')[1];
//             const buffer = Buffer.from(base64Data, 'base64');

//             // Upload to Hostinger FTP
//             await new Promise((resolve, reject) => {
//               ftpClient.put(buffer, filename, (err) => {
//                 if (err) {
//                   console.error(`❌ FTP upload failed for ${filename}:`, err.message);
//                   reject(err);
//                 } else {
//                   resolve();
//                 }
//               });
//             });

//             return { ...product, image: `${HOSTINGER_PUBLIC_URL}${filename}` };
//           } else if (product.image.startsWith('http')) {
//             // // console.log('product.image :>> ', product.image);
//             // const response = await axios.get('https://th.bing.com/th/id/OIP.CdiUz5TXrORPZz-fxwGCEwAAAA', {
//             //   responseType: 'arraybuffer'
//             // });

//             // const buffer = Buffer.from(response.data, 'binary');
//             // console.log('Image buffer:', buffer);
//             // // Keep URL-based images as is
//             // return { ...product };

//             // Handle external URL images
//             const randomSuffix = Math.floor(Math.random() * 1000);
//             const safeName = sanitizeFilename(product.name || 'image');
//             const extensionMatch = product.image.match(/\.(jpg|jpeg|png|gif)$/i);
//             const extension = extensionMatch ? extensionMatch[1].toLowerCase() : 'jpg';
//             const filename = `${safeName}_${Date.now()}_${randomSuffix}.${extension}`;

//             // Download image
//             console.log(`📥 Downloading image for ${product.name}: ${product.image}`);
//             const response = await axios.get(product.image, {
//               responseType: 'arraybuffer',
//               headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//                 'Accept': 'image/*',
//                 'Referer': 'https://www.google.com/',
//               },
//               timeout: 15000, // 15-second timeout
//               validateStatus: (status) => status >= 200 && status < 300,
//             });

//             const buffer = Buffer.from(response.data);
//             if (buffer.length < 100) {
//               throw new Error('Downloaded image is too small or invalid');
//             }

//             // Upload to Hostinger FTP
//             console.log(`📤 Uploading to FTP: ${filename}`);
//             await new Promise((resolve, reject) => {
//               ftpClient.put(buffer, filename, (err) => {
//                 if (err) {
//                   console.error(`❌ FTP upload failed for ${filename}:`, err.message);
//                   reject(err);
//                 } else {
//                   console.log(`✅ Uploaded ${filename} to FTP`);
//                   resolve();
//                 }
//               });
//             });

//             return { ...product, image: `${HOSTINGER_PUBLIC_URL}${filename}` };
//           } else {
//             throw new Error('Invalid image format');
//           }
//         } catch (err) {
//           console.error(`❌ Failed to process image for ${product.name}:`, err.message);
//           return { ...product, image: 'Not found due to decode/upload error' };
//         }
//       }));

//       await fs.writeFile(outputFile, JSON.stringify(updatedData, null, 2));
//       console.log(`✅ Converted ${inputFile} to ${outputFile}`);
//     } catch (error) {
//       console.error(`❌ Error processing ${file}:`, error.message);
//     }
//   }

//   // Close FTP connection
//   await new Promise((resolve) => ftpClient.end(resolve));
// }

// convertBase64ToUrlWithHostinger().catch(console.error);

// const fs = require('fs').promises;
// const path = require('path');
// const ftp = require('ftp');
// const axios = require('axios');

// function sanitizeFilename(name) {
//   return name.replace(/[^a-z0-9_\-]/gi, '-').substring(0, 50); // limit length
// }

// async function convertBase64ToUrlWithHostinger() {
//   const OUTPUT_DIR = 'C:\\Projects\\Hyperzod-Scraping\\product_cards';
//   const OUTPUT_DIR2 = 'C:\\Projects\\Hyperzod-Scraping\\products';

//   const baseFilePattern = 'product_data-2_';
//   const convertedFilePattern = 'product_';

//   const HOSTINGER_HOST = 'ftp.sahildudhat.com';
//   const HOSTINGER_USER = 'u121802690.HYP1212';
//   const HOSTINGER_PASSWORD = '2Ya6ZIT53jv@=I0';
//   const HOSTINGER_PUBLIC_URL = 'https://sahildudhat.com/hyp-images/';

//   await fs.mkdir(OUTPUT_DIR2, { recursive: true });

//   const files = (await fs.readdir(OUTPUT_DIR))
//     .filter(file => file.startsWith(baseFilePattern) && file.endsWith('.json'))
//     .sort((a, b) => {
//       const numA = parseInt(a.split('_')[2].split('.')[0]);
//       const numB = parseInt(b.split('_')[2].split('.')[0]);
//       return numA - numB;
//     });

//   const ftpClient = new ftp();

//   await new Promise((resolve, reject) => {
//     ftpClient.connect({
//       host: HOSTINGER_HOST,
//       user: HOSTINGER_USER,
//       password: HOSTINGER_PASSWORD,
//       secure: false,
//     });
//     ftpClient.on('ready', resolve);
//     ftpClient.on('error', reject);
//   });

//   console.log('✅ FTP Connected');

//   for (const file of files) {
//     const batchNumber = parseInt(file.split('_')[2].split('.')[0]);
//     const inputFile = path.join(OUTPUT_DIR, file);
//     const outputFile = path.join(OUTPUT_DIR2, `${convertedFilePattern}${batchNumber}.json`);

//     try {
//       const data = JSON.parse(await fs.readFile(inputFile, 'utf8'));

//       const updatedData = await Promise.all(data.map(async (product) => {
//         const originalImage = product.image;

//         if (!originalImage || originalImage.includes('Not found')) {
//           return { ...product, image: 'Not found' };
//         }

//         try {
//           const randomSuffix = Math.floor(Math.random() * 1000);
//           const safeName = sanitizeFilename(product.name || 'image');
//           const extensionMatch = originalImage.match(/\.(jpg|jpeg|png|gif)$/i);
//           const extension = extensionMatch ? extensionMatch[1].toLowerCase() : 'jpg';
//           const filename = `${safeName}_${Date.now()}_${randomSuffix}.${extension}`;
//           const ftpPath = `/${filename}`;

//           let buffer;

//           if (originalImage.startsWith('data:image/')) {
//             const base64Data = originalImage.split(',')[1];
//             buffer = Buffer.from(base64Data, 'base64');
//           } else if (originalImage.startsWith('http')) {
//             buffer = await downloadImageWithRetry(originalImage);
//             if (!buffer || buffer.length < 100) {
//               console.warn(`⚠️ Skipping too small or invalid image: ${originalImage}`);
//               return { ...product, image: 'Not found due to small size or invalid image' };
//             }
//           } else {
//             throw new Error('Invalid image format');
//           }

//           // Upload to FTP
//           console.log(`📤 Uploading ${filename}`);
//           await new Promise((resolve, reject) => {
//             ftpClient.put(buffer, ftpPath, (err) => {
//               if (err) {
//                 console.error(`❌ FTP upload failed for ${filename}:`, err.message);
//                 reject(err);
//               } else {
//                 console.log(`✅ Uploaded: ${filename}`);
//                 resolve();
//               }
//             });
//           });

//           return { ...product, image: `${HOSTINGER_PUBLIC_URL}${filename}` };
//         } catch (err) {
//           console.error(`❌ Failed to process image for ${product.name}:`, err.message);
//           return { ...product, image: 'Not found due to decode/upload error' };
//         }
//       }));

//       await fs.writeFile(outputFile, JSON.stringify(updatedData, null, 2));
//       console.log(`✅ Converted ${inputFile} → ${outputFile}`);
//     } catch (error) {
//       console.error(`❌ Error processing ${file}:`, error.message);
//     }
//   }

//   // Close FTP connection
//   ftpClient.end(() => console.log('🔌 FTP connection closed'));
// }

// async function downloadImageWithRetry(url, retries = 3) {
//   while (retries-- > 0) {
//     try {
//       const response = await axios.get(url, {
//         responseType: 'arraybuffer',
//         headers: {
//           'User-Agent': 'Mozilla/5.0',
//           'Accept': 'image/*',
//           'Referer': 'https://www.google.com/',
//         },
//         timeout: 15000,
//         validateStatus: (status) => status >= 200 && status < 300,
//       });

//       const contentType = response.headers['content-type'] || '';
//       if (!contentType.startsWith('image/')) {
//         throw new Error(`Invalid content-type: ${contentType}`);
//       }

//       return Buffer.from(response.data);
//     } catch (err) {
//       console.warn(`⏳ Retry (${3 - retries}): ${url} - ${err.message}`);
//       await new Promise(res => setTimeout(res, 2000));
//     }
//   }
//   throw new Error(`Failed to download image after retries: ${url}`);
// }

// convertBase64ToUrlWithHostinger().catch(console.error);




///////////////////
///////////////////
///////////////////
///////////////////
///////////////////
///////////////////
///////////////////
///////////////////
///////////////////
///////////////////
///////////////////
///////////////////



// const fs = require('fs').promises;
// const path = require('path');

// async function combineJsonFiles() {
//   const INPUT_DIR = 'C:\\Projects\\Hyperzod-Scraping\\product_cards'; // Source JSON directory
//   const OUTPUT_DIR = 'C:\\Projects\\Hyperzod-Scraping\\products';     // Output JSON directory
//   const OUTPUT_FILE = path.join(OUTPUT_DIR, 'combined_products.json'); // Output file
//   const baseFilePattern = 'product_data-2_';

//   // Ensure output directory exists
//   try {
//     await fs.mkdir(OUTPUT_DIR, { recursive: true });
//     console.log(`📁 Ensured output directory exists: ${OUTPUT_DIR}`);
//   } catch (err) {
//     console.error(`❌ Failed to create output directory ${OUTPUT_DIR}:`, err.message);
//     return;
//   }

//   // Read input JSON files
//   let files;
//   try {
//     files = (await fs.readdir(INPUT_DIR))
//       .filter(file => file.startsWith(baseFilePattern) && file.endsWith('.json'))
//       .sort((a, b) => {
//         const numA = parseInt(a.split('_')[2].split('.')[0]);
//         const numB = parseInt(b.split('_')[2].split('.')[0]);
//         return numA - numB;
//       });
//     console.log(`📂 Found ${files.length} JSON files to combine`);
//   } catch (err) {
//     console.error('❌ Failed to read input directory:', err.message);
//     return;
//   }

//   // Combine data from all files
//   const combinedData = [];
//   for (const file of files) {
//     const inputFile = path.join(INPUT_DIR, file);
//     console.log(`📄 Reading file: ${inputFile}`);
//     try {
//       const data = JSON.parse(await fs.readFile(inputFile, 'utf8'));
//       if (!Array.isArray(data)) {
//         console.error(`❌ ${file} does not contain a valid JSON array`);
//         continue;
//       }
//       combinedData.push(...data);
//       console.log(`✅ Added ${data.length} products from ${file}`);
//     } catch (err) {
//       console.error(`❌ Failed to process ${file}:`, err.message);
//     }
//   }

//   // Write combined data to output file
//   try {
//     console.log(`💾 Writing combined data to: ${OUTPUT_FILE}`);
//     await fs.writeFile(OUTPUT_FILE, JSON.stringify(combinedData, null, 2));
//     console.log(`✅ Combined ${combinedData.length} products into ${OUTPUT_FILE}`);
//   } catch (err) {
//     console.error(`❌ Failed to write output file ${OUTPUT_FILE}:`, err.message);
//   }
// }

// combineJsonFiles().catch((err) => console.error('❌ Script failed:', err.message));













// const fs = require('fs').promises;
// const path = require('path');
// const axios = require('axios');
// const puppeteer = require('puppeteer');

// function sanitizeFilename(name) {
//   return name.replace(/[^a-z0-9_\-]/gi, '-').slice(0, 50); // Limit filename length
// }

// // Retry function for HTTP downloads
// async function withRetry(operation, maxRetries = 3, delayMs = 1000) {
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       return await operation();
//     } catch (err) {
//       if (attempt === maxRetries) throw err;
//       console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}. Retrying in ${delayMs}ms...`);
//       await new Promise(resolve => setTimeout(resolve, delayMs));
//     }
//   }
// }

// // Fetch image using Puppeteer as a fallback
// async function fetchImageWithPuppeteer(url) {
//   console.log(`🌐 Using Puppeteer to fetch image: ${url}`);
//   const browser = await puppeteer.launch({ headless: true });
//   try {
//     const page = await browser.newPage();
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

//     // Find the image element or direct image
//     const imgData = await page.evaluate(() => {
//       const img = document.querySelector('img');
//       return img ? img.src : null;
//     });

//     if (!imgData) throw new Error('No image found on page');

//     // Download the actual image
//     const response = await axios.get(imgData, {
//       responseType: 'arraybuffer',
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//         'Accept': 'image/*',
//         'Referer': 'https://www.bing.com/',
//       },
//       timeout: 20000,
//     });

//     return Buffer.from(response.data);
//   } catch (err) {
//     throw new Error(`Puppeteer failed: ${err.message}`);
//   } finally {
//     await browser.close();
//   }
// }

// async function downloadImagesFromJson() {
//   const JSON_FILE = 'C:\\Projects\\Hyperzod-Scraping\\products\\combined_products.json'; // Input JSON
//   const OUTPUT_DIR = 'C:\\Projects\\Hyperzod-Scraping\\products\\Images'; // Image output directory
//   const HOSTINGER_URL = 'https://sahildudhat.com/hyp-images/';

//   // Ensure output directory exists
//   try {
//     await fs.mkdir(OUTPUT_DIR, { recursive: true });
//     console.log(`📁 Ensured image directory exists: ${OUTPUT_DIR}`);
//   } catch (err) {
//     console.error(`❌ Failed to create image directory ${OUTPUT_DIR}:`, err.message);
//     return;
//   }

//   // Read the combined JSON file
//   let data;
//   try {
//     data = JSON.parse(await fs.readFile(JSON_FILE, 'utf8'));
//     if (!Array.isArray(data)) throw new Error('JSON data is not an array');
//     console.log(`📂 Loaded ${data.length} products from ${JSON_FILE}`);
//   } catch (err) {
//     console.error(`❌ Failed to read or parse ${JSON_FILE}:`, err.message);
//     return;
//   }

//   // Process each product
//   let processedImages = 0;
//   const updatedData = await Promise.all(data.map(async (product, index) => {
//     // Skip invalid, missing, or Hostinger-hosted images
//     if (!product.image || 
//         product.image === 'Not found' || 
//         product.image === 'Not found due to decode/upload error' || 
//         product.image === 'Not found due to repeated errors or bot detection' ||
//         product.image.startsWith(HOSTINGER_URL)) {
//       console.log(`ℹ️ Skipped image for ${product.name || `product_${index}`}: ${product.image || 'No image'}`);
//       return { ...product, image: product.image || 'Not found' };
//     }

//     try {
//       if (product.image.startsWith('data:image/')) {
//         // Handle base64 images
//         const randomSuffix = Math.floor(Math.random() * 1000);
//         const safeName = sanitizeFilename(product.name || `image_${index}`);
//         const mimeType = product.image.match(/^data:image\/(.*?);base64,/i)?.[1] || 'jpeg';
//         const extension = mimeType === 'jpeg' ? 'jpg' : mimeType.toLowerCase();
//         const filename = `${safeName}_${randomSuffix}.${extension}`;
//         const outputPath = path.join(OUTPUT_DIR, filename);
//         const base64Data = product.image.split(',')[1];
//         const buffer = Buffer.from(base64Data, 'base64');

//         // Save base64 image to file
//         console.log(`💾 Saving base64 image for ${product.name || `product_${index}`}: ${outputPath}`);
//         await fs.writeFile(outputPath, buffer);
//         console.log(`✅ Saved ${filename} to ${OUTPUT_DIR}`);
//         processedImages++;

//         return { ...product, image: `Images/${filename}` };
//       } else if (product.image.startsWith('http')) {
//         // Handle HTTP images (including Bing)
//         const randomSuffix = Math.floor(Math.random() * 1000);
//         const safeName = sanitizeFilename(product.name || `image_${index}`);
//         const extensionMatch = product.image.match(/\.(jpg|jpeg|png|gif)$/i);
//         const extension = extensionMatch ? extensionMatch[1].toLowerCase() : 'jpg';
//         const filename = `${safeName}_${randomSuffix}.${extension}`;
//         const outputPath = path.join(OUTPUT_DIR, filename);

//         // Try downloading with axios first
//         let buffer;
//         try {
//           console.log(`📥 Downloading image with axios for ${product.name || `product_${index}`}: ${product.image}`);
//           const response = await withRetry(() => axios.get(product.image, {
//             responseType: 'arraybuffer',
//             headers: {
//               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//               'Accept': 'image/*',
//               'Referer': product.image.includes('bing.com') ? 'https://www.bing.com/' : 'https://www.google.com/',
//               'Accept-Encoding': 'gzip, deflate, br',
//               'Connection': 'keep-alive',
//             },
//             maxRedirects: 5,
//             timeout: 20000,
//             validateStatus: (status) => status >= 200 && status < 300,
//           }));
//           buffer = Buffer.from(response.data);
//         } catch (err) {
//           console.warn(`⚠️ Axios failed for ${product.image}: ${err.message}. Trying Puppeteer...`);
//           // Fallback to Puppeteer for Bing URLs
//           buffer = await withRetry(() => fetchImageWithPuppeteer(product.image));
//         }

//         if (buffer.length < 100) {
//           throw new Error('Downloaded image is too small or invalid');
//         }

//         // Save to file
//         console.log(`💾 Saving to file: ${outputPath}`);
//         await fs.writeFile(outputPath, buffer);
//         console.log(`✅ Saved ${filename} to ${OUTPUT_DIR}`);
//         processedImages++;

//         return { ...product, image: `Images/${filename}` };
//       } else {
//         throw new Error('Invalid image format');
//       }
//     } catch (err) {
//       console.error(`❌ Failed to process image for ${product.name || `product_${index}`} (URL: ${product.image}):`, err.message);
//       return { ...product, image: `Not found due to decode/download error: ${err.message}` };
//     }
//   }));

//   // Write updated JSON
//   try {
//     console.log(`💾 Writing updated JSON to: ${JSON_FILE}`);
//     await fs.writeFile(JSON_FILE, JSON.stringify(updatedData, null, 2));
//     console.log(`✅ Updated ${JSON_FILE} with ${processedImages} images downloaded`);
//   } catch (err) {
//     console.error(`❌ Failed to write updated JSON ${JSON_FILE}:`, err.message);
//   }
// }

// downloadImagesFromJson().catch((err) => console.error('❌ Script failed:', err.message));