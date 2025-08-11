// const fs = require('fs');
// const path = require('path');

// const sourceDir = 'C:/Projects/Hyperzod-Scraping/cd';
// const targetDir = 'C:/Projects/Hyperzod-Scraping/imgs';

// // Create target directory if it doesn't exist
// if (!fs.existsSync(targetDir)) {
//   fs.mkdirSync(targetDir, { recursive: true });
// }

// // Supported image extensions
// const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// function copyImagesRecursively(currentDir) {
//   const items = fs.readdirSync(currentDir);

//   items.forEach(item => {
//     const fullPath = path.join(currentDir, item);
//     const stat = fs.statSync(fullPath);

//     if (stat.isDirectory()) {
//       copyImagesRecursively(fullPath); // recurse into subfolder
//     } else {
//       const ext = path.extname(fullPath).toLowerCase();
//       if (imageExtensions.includes(ext)) {
//         const filename = path.basename(fullPath);
//         const destinationPath = path.join(targetDir, filename);

//         // If filename already exists, avoid overwrite by appending a counter
//         let finalPath = destinationPath;
//         let counter = 1;
//         while (fs.existsSync(finalPath)) {
//           const name = path.parse(filename).name;
//           const ext = path.extname(filename);
//           finalPath = path.join(targetDir, `${name}_${counter}${ext}`);
//           counter++;
//         }

//         fs.copyFileSync(fullPath, finalPath);
//         console.log(`Copied: ${fullPath} → ${finalPath}`);
//       }
//     }
//   });
// }

// // Start copying
// copyImagesRecursively(sourceDir);

// console.log('✅ All images copied to:', targetDir);



const fs = require('fs');
const path = require('path');

const sourceDir = 'C:/Projects/Hyperzod-Scraping/cd';
const targetDir = 'C:/Projects/Hyperzod-Scraping/imgs2';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

function copyImagesRecursively(currentDir, relativePath = '') {
  const items = fs.readdirSync(currentDir);

  items.forEach(item => {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const newRelPath = path.join(relativePath, item);
      copyImagesRecursively(fullPath, newRelPath); // recurse
    } else {
      const ext = path.extname(item).toLowerCase();
      if (imageExtensions.includes(ext)) {
        const baseName = path.basename(item);
        const folderName = path.basename(relativePath || path.dirname(fullPath));
        const newFileName = `${folderName}_${baseName}`;
        let finalPath = path.join(targetDir, newFileName);

        // Avoid overwriting by appending a counter
        let counter = 1;
        while (fs.existsSync(finalPath)) {
          const name = path.parse(newFileName).name;
          finalPath = path.join(targetDir, `${name}_${counter}${ext}`);
          counter++;
        }

        fs.copyFileSync(fullPath, finalPath);
        console.log(`Copied: ${fullPath} → ${finalPath}`);
      }
    }
  });
}

copyImagesRecursively(sourceDir);
console.log('✅ All images copied to:', targetDir);
