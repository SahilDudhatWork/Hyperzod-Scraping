// const express = require("express");
// const cron = require("node-cron");
// const fs = require("fs");
// const path = require("path");
// const app = express();
// const BranchA = require("./Products/BranchA");
// const BranchB = require("./Products/BranchB");
// const BranchC = require("./Products/BranchC");
// const BranchD = require("./Products/BranchD");
// const MerchantsA = require("./Merchants/MerchantsA");
// const MerchantsB = require("./Merchants/MerchantsB");
// const MerchantsC = require("./Merchants/MerchantsC");
// const MerchantsD = require("./Merchants/MerchantsD");
// const {
//   fetchCategoryTree,
//   readCategoryTree,
// } = require("./utils/fetchCategoryTree");
// const PORT = process.env.PORT || 8080;
// const test = async () => {
//   try {
//     console.log("Running a task every day at 5 AM UK time");
//     const csvFilePathBranchA = path.join(__dirname, "./BranchA.csv");
//     const csvFilePathBranchB = path.join(__dirname, "./BranchB.csv");
//     const csvFilePathBranchC = path.join(__dirname, "./BranchC.csv");
//     const csvFilePathBranchD = path.join(__dirname, "./BranchD.csv");
//     const apiLogFile = path.join(__dirname, "./Api-Log.json");

//     if (fs.existsSync(csvFilePathBranchA)) {
//       fs.unlinkSync(csvFilePathBranchA);
//       console.log("Existing BranchA file removed.");
//     }
//     if (fs.existsSync(csvFilePathBranchB)) {
//       fs.unlinkSync(csvFilePathBranchB);
//       console.log("Existing BranchB file removed.");
//     }
//     if (fs.existsSync(csvFilePathBranchC)) {
//       fs.unlinkSync(csvFilePathBranchC);
//       console.log("Existing BranchC file removed.");
//     }
//     if (fs.existsSync(csvFilePathBranchD)) {
//       fs.unlinkSync(csvFilePathBranchD);
//       console.log("Existing BranchD file removed.");
//     }
//     if (fs.existsSync(apiLogFile)) {
//       fs.unlinkSync(apiLogFile);
//       console.log("Existing Api Log File file removed.");
//     }

//     await fetchCategoryTree();
//     await new Promise((resolve) => setTimeout(resolve, 5000));

//     const readCategoryTreeResult = await readCategoryTree();
//     console.log(
//       "readCategoryTreeResult.length :>> ",
//       readCategoryTreeResult.length
//     );

//     let index = 0;
//     for (const i1 of readCategoryTreeResult) {
//       if (i1.name != "Tool Hire" && i1.name != "Benchmarx Kitchens") {
//         console.log("Category-->", i1.name);
//         if (i1.subCategories.length > 0) {
//           for (const i2 of i1.subCategories) {
//             if (i2.subCategories.length > 0) {
//               for (const i3 of i2.subCategories) {
//                 await BranchA(i3, i1.name);
//                 await BranchB(i3, i1.name);
//                 await BranchC(i3, i1.name);
//                 await BranchD(i3, i1.name);

//                 if (i3.subCategories.length > 0) {
//                   for (const i4 of i3.subCategories) {
//                     if (i4.subCategories.length > 0) {
//                       await BranchA(i4, i1.name);
//                       await BranchB(i4, i1.name);
//                       await BranchC(i4, i1.name);
//                       await BranchD(i4, i1.name);
//                     }
//                   }
//                 }
//               }
//             }
//           }
//           index++;
//           console.log("*=*=*=*=*=*=*=*=*=*=*=*= :>> ", index);
//         }
//       }
//     }

//     await MerchantsA();
//     await MerchantsB();
//     await MerchantsC();
//     await MerchantsD();
//     console.log(
//       "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31mAll Products successfully Imported.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
//     );
//   } catch (error) {
//     console.error("Error during initial execution:", error);
//   }
// };
// const timezone = "Europe/London"; // Set timezone to UK
// const schedule = "0 4 * * *"; // UK cron job at 4 AM

// // const timezone = "Asia/Kolkata"; // Set timezone to IST
// // const schedule = "0 1 * * *"; // Runs at 6:30 AM IST

// cron.schedule(
//   schedule,
//   async () => {
//     try {
//       console.log("Running a task every day at 5 AM UK time");
//       test();
//       console.log(
//         "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31mAll Products successfully Imported.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
//       );
//     } catch (error) {
//       console.error("Error during initial execution:", error);
//     }
//   },
//   {
//     timezone: timezone, // Set timezone to UK time
//   }
// );
// test();
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "WelCome - V1.0.1" });
// });

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// ! =-=-=-=-=-=-
// ! =-=-=-=-=-=-

// Import required modules
const express = require("express");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const app = express();

const BranchA = require("./Products/BranchA");
const BranchB = require("./Products/BranchB");
const BranchC = require("./Products/BranchC");
const BranchD = require("./Products/BranchD");

const MerchantsA = require("./Merchants/MerchantsA");
const MerchantsB = require("./Merchants/MerchantsB");
const MerchantsC = require("./Merchants/MerchantsC");
const MerchantsD = require("./Merchants/MerchantsD");

const {
  fetchCategoryTree,
  readCategoryTree,
} = require("./utils/fetchCategoryTree");

const PORT = process.env.PORT || 8080;
const timezone = "Europe/London";
const schedule = "0 4 * * *";

// Function to clean up existing files
const cleanupFiles = async () => {
  const filesToRemove = [
    "./BranchA.csv",
    "./BranchB.csv",
    "./BranchC.csv",
    "./BranchD.csv",
    "./Api-Log.json",
  ];

  for (const file of filesToRemove) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed file: ${file}`);
    }
  }
};

// Function to process a branch
const processBranch = async (branchFunction, categoryTree, branchName) => {
  for (const category of categoryTree) {
    if (
      category.name !== "Tool Hire" &&
      category.name !== "Benchmarx Kitchens"
    ) {
      console.log(`Processing category: ${category.name}`);

      for (const subCategory of category.subCategories) {
        await branchFunction(subCategory, branchName);

        for (const subSubCategory of subCategory.subCategories) {
          await branchFunction(subSubCategory, branchName);

          for (const subSubSubCategory of subSubCategory.subCategories) {
            await branchFunction(subSubSubCategory, branchName);
          }
        }
      }
    }
  }
};

// Function to process a merchant
const processMerchant = async (merchantFunction) => {
  await merchantFunction();
};

// Main task runner
const taskRunner = async () => {
  try {
    console.log(
      "Task started: Cleaning up files and processing branches/merchants"
    );

    await cleanupFiles();
    await fetchCategoryTree();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const categoryTree = await readCategoryTree();
    console.log(`Category tree loaded with ${categoryTree.length} items.`);

    // Sequential processing
    await processBranch(BranchA, categoryTree, "BranchA");
    await processMerchant(MerchantsA);

    await processBranch(BranchB, categoryTree, "BranchB");
    await processMerchant(MerchantsB);

    await processBranch(BranchC, categoryTree, "BranchC");
    await processMerchant(MerchantsC);

    await processBranch(BranchD, categoryTree, "BranchD");
    await processMerchant(MerchantsD);

    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31mAll Products successfully Imported.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error during task execution:", error);
  }
};

// Schedule the cron job
cron.schedule(
  schedule,
  async () => {
    console.log("Running the scheduled task.");
    await taskRunner();
  },
  {
    timezone: timezone,
  }
);

// Initial run
taskRunner();

// Set up the server
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome - V1.0.1" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
