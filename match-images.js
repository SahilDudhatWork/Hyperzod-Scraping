// const fs = require('fs');
// const fsp = require('fs').promises;
// const path = require('path');
// const csv = require('csv-parser');
// const fastCsv = require('fast-csv');
// const stringSimilarity = require('string-similarity');
// const ftp = require('ftp');

// // === Config ===
// const csvPath = 'C:/Projects/Hyperzod-Scraping/CSV/merged_CSV copy.csv';
// const imagesDir = 'C:/Projects/Hyperzod-Scraping/imgs';
// const outputCsvPath = 'C:/Projects/Hyperzod-Scraping/CSV/output.csv';

// const HOSTINGER_PUBLIC_URL = 'https://sahildudhat.com/hyp-images/';
// const HOSTINGER_FTP_CONFIG = {
//   host: 'ftp.sahildudhat.com',
//   user: 'u121802690.HYP1212',
//   password: '2Ya6ZIT53jv@=I0',
//   secure: false,
// };

// function sanitizeFilename(name) {
//   return name.replace(/[^a-z0-9_\-]/gi, '-');
// }

// const ftpClient = new ftp();

// function connectFTP() {
//   return new Promise((resolve, reject) => {
//     ftpClient.connect(HOSTINGER_FTP_CONFIG);
//     ftpClient.on('ready', resolve);
//     ftpClient.on('error', reject);
//   });
// }

// function uploadToHostinger(localPath, remoteName) {
//   return new Promise((resolve, reject) => {
//     ftpClient.put(localPath, remoteName, (err) => {
//       if (err) {
//         console.error(`❌ FTP upload failed for ${remoteName}:`, err.message);
//         return reject(err);
//       }
//       resolve(`${HOSTINGER_PUBLIC_URL}${remoteName}`);
//     });
//   });
// }

// (async () => {
//   if (!fs.existsSync(csvPath)) {
//     console.error('❌ CSV file not found at:', csvPath);
//     process.exit(1);
//   }

//   if (!fs.existsSync(imagesDir)) {
//     console.error('❌ Image folder not found at:', imagesDir);
//     process.exit(1);
//   }

//   const imageFiles = await fsp.readdir(imagesDir);
//   const imageFilenamesLower = imageFiles.map(f => f.toLowerCase());

//   let matched = 0;
//   let unmatched = 0;
//   let totalDescriptions = 0;
//   const finalRows = [];
//   const uploadedImagesCache = new Map(); // ✅ Cache to avoid re-uploads

//   console.log('🔌 Connecting to FTP...');
//   await connectFTP();
//   console.log('✅ Connected to FTP');

//   const csvRows = [];
//   await new Promise((resolve, reject) => {
//     fs.createReadStream(csvPath)
//       .pipe(csv())
//       .on('data', row => csvRows.push(row))
//       .on('end', resolve)
//       .on('error', reject);
//   });

//   for (const row of csvRows) {
//     const description = row['Item Description'];
//     totalDescriptions++;

//     const match = stringSimilarity.findBestMatch(description.toLowerCase(), imageFilenamesLower);
//     const bestMatch = match.bestMatch.rating > 0.4 ? match.bestMatch.target : null;

//     if (bestMatch) {
//       const originalFilename = imageFiles.find(f => f.toLowerCase() === bestMatch);

//       if (uploadedImagesCache.has(bestMatch)) {
//         // ✅ Reuse uploaded image URL
//         row.image = uploadedImagesCache.get(bestMatch);
//       } else {
//         matched++;
//         const localImagePath = path.join(imagesDir, originalFilename);
//         const safeName = sanitizeFilename(description);
//         const remoteFilename = `${safeName}_${Date.now()}_${Math.floor(Math.random() * 1000)}${path.extname(originalFilename)}`;

//         try {
//           const url = await uploadToHostinger(localImagePath, remoteFilename);
//           uploadedImagesCache.set(bestMatch, url); // ✅ Cache it
//           row.image = url;
//         } catch (err) {
//           row.image = '';
//         }
//       }

//     } else {
//       unmatched++;
//       row.image = '';
//     }

//     finalRows.push(row);
//   }

//   const ws = fs.createWriteStream(outputCsvPath);
//   fastCsv.write(finalRows, { headers: true }).pipe(ws).on('finish', () => {
//     console.log('\n✅ Matching complete');
//     console.log(`🔢 Total Descriptions: ${totalDescriptions}`);
//     console.log(`✅ Matched & Uploaded: ${matched}`);
//     console.log(`❌ Not Matched: ${unmatched}`);
//     console.log(`📁 Output CSV: ${outputCsvPath}`);
//     ftpClient.end();
//   });
// })();


const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const fastCsv = require('fast-csv');
const stringSimilarity = require('string-similarity');
const ftp = require('ftp');

// === Config ===
const csvPath = 'C:/Projects/Hyperzod-Scraping/CSV/merged_CSV copy.csv';
const imagesDir = 'C:/Projects/Hyperzod-Scraping/imgs2';
const outputCsvPath = 'C:/Projects/Hyperzod-Scraping/CSV/output.csv';

const HOSTINGER_PUBLIC_URL = 'https://sahildudhat.com/hyp-images/';
const HOSTINGER_FTP_CONFIG = {
  host: 'ftp.sahildudhat.com',
  user: 'u121802690.HYP1212',
  password: '2Ya6ZIT53jv@=I0',
  secure: false,
  connTimeout: 10000,
  pasvTimeout: 10000,
  keepalive: 10000,
};

// === Helpers ===
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-]/gi, '-');
}

function normalize(text) {
  return text?.toLowerCase().replace(/[^a-z0-9]/gi, '') || '';
}

function connectFTP() {
  return new Promise((resolve, reject) => {
    ftpClient.connect(HOSTINGER_FTP_CONFIG);
    ftpClient.on('ready', resolve);
    ftpClient.on('error', reject);
  });
}

function uploadToHostinger(localPath, remoteName) {
  return new Promise((resolve, reject) => {
    ftpClient.put(localPath, remoteName, (err) => {
      if (err) return reject(err);
      resolve(`${HOSTINGER_PUBLIC_URL}${remoteName}`);
    });
  });
}

async function uploadWithRetry(localPath, remoteName, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const url = await uploadToHostinger(localPath, remoteName);
      return url;
    } catch (err) {
      if (i === retries) throw err;
      console.warn(`🔁 Retry (${i + 1}/${retries}) for ${remoteName}: ${err.message}`);
      await new Promise(res => setTimeout(res, 1000));
    }
  }
}

async function getAllImagesWithFolderPrefix(baseDir) {
  const files = [];

  async function walk(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg'].includes(ext)) {
          const relativeFolder = path.relative(baseDir, path.dirname(fullPath));
          const folderName = path.basename(relativeFolder || '');
          const keyName = `${folderName}_${entry.name}`.toLowerCase();
          files.push({ key: keyName, fullPath, original: entry.name });
        }
      }
    }
  }

  await walk(baseDir);
  return files;
}

function matchImage(imageKeys, inputText) {
  const normalizedInput = normalize(inputText);

  // 1. Exact match (case-insensitive)
  for (const key of imageKeys) {
    if (key === inputText.toLowerCase()) return key;
  }

  // 2. Partial match (includes)
  for (const key of imageKeys) {
    if (key.includes(inputText.toLowerCase())) return key;
  }

  // 3. Normalized exact match
  for (const key of imageKeys) {
    if (normalize(key) === normalizedInput) return key;
  }

  // 4. Normalized partial match
  for (const key of imageKeys) {
    if (normalize(key).includes(normalizedInput)) return key;
  }

  // 5. Fuzzy match
  const fuzzy = stringSimilarity.findBestMatch(inputText.toLowerCase(), imageKeys);
  return fuzzy.bestMatch.rating > 0.4 ? fuzzy.bestMatch.target : null;
}

const ftpClient = new ftp();

(async () => {
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    process.exit(1);
  }

  if (!fs.existsSync(imagesDir)) {
    console.error('❌ Image folder not found at:', imagesDir);
    process.exit(1);
  }

  console.log('📂 Scanning image folders...');
  const imageFiles = await getAllImagesWithFolderPrefix(imagesDir);
  const imageKeys = imageFiles.map(i => i.key);

  let matched = 0;
  let unmatched = 0;
  let total = 0;
  const finalRows = [];
  const uploadedCache = new Map();

  console.log('🔌 Connecting to FTP...');
  await connectFTP();
  console.log('✅ Connected to FTP');

  const csvRows = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', row => csvRows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of csvRows) {
    total++;
    const description = row['Item Description'] || '';
    const name = row['Item Name'] || '';

    let bestKey =
      matchImage(imageKeys, description) ||
      matchImage(imageKeys, name);

    if (bestKey) {
      const fileObj = imageFiles.find(img => img.key === bestKey);

      if (uploadedCache.has(bestKey)) {
        row.image = uploadedCache.get(bestKey);
      } else {
        matched++;
        const safeName = sanitizeFilename(name || description);
        const remoteName = `${safeName}_${Date.now()}_${Math.floor(Math.random() * 1000)}${path.extname(fileObj.original)}`;

        try {
          const url = await uploadWithRetry(fileObj.fullPath, remoteName);
          uploadedCache.set(bestKey, url);
          row.image = url;
        } catch (err) {
          console.error(`❌ Upload failed: ${err.message}`);
          row.image = '';
        }
      }
    } else {
      unmatched++;
      row.image = '';
    }

    finalRows.push(row);
  }

  const ws = fs.createWriteStream(outputCsvPath);
  fastCsv.write(finalRows, { headers: true }).pipe(ws).on('finish', () => {
    console.log('\n✅ Matching complete');
    console.log(`🔢 Total Rows: ${total}`);
    console.log(`✅ Matched & Uploaded: ${matched}`);
    console.log(`❌ Not Matched: ${unmatched}`);
    console.log(`📁 Output CSV created: ${outputCsvPath}`);
    ftpClient.end();
  });
})();
