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
const timezone = "Europe/London"; // Set timezone to UK

// Utility function to remove files
const cleanupFiles = async () => {
  const files = [
    "./BranchA.csv",
    "./BranchB.csv",
    "./BranchC.csv",
    "./BranchD.csv",
    "./Api-Log.json",
  ];
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed file: ${file}`);
    }
  }
};

// Function to process a specific branch and merchant
const processBranchAndMerchant = async (
  branchFunction,
  merchantFunction,
  branchName
) => {
  try {
    console.log(`Starting process for ${branchName} ==>>`);
    const categoryTree = await readCategoryTree();

    for (const category of categoryTree) {
      if (
        category.name !== "Tool Hire" &&
        category.name !== "Benchmarx Kitchens"
      ) {
        console.log(`Category: ${category.name}`);
        for (const subCategory of category.subCategories) {
          for (const subSubCategory of subCategory.subCategories) {
            await branchFunction(subSubCategory, category.name);

            for (const subSubSubCategory of subSubCategory.subCategories) {
              await branchFunction(subSubSubCategory, category.name);
            }
          }
        }
      }
    }

    console.log(`Finished processing categories for ${branchName}`);
    await merchantFunction();
    console.log(`Finished processing merchants for ${branchName}`);
  } catch (error) {
    console.error(`Error processing ${branchName}:`, error);
  }
};

// Task runner for a single cron job
const taskRunner = async (branchFunction, merchantFunction, branchName) => {
  try {
    console.log(`Starting task for ${branchName}`);
    await cleanupFiles();
    await fetchCategoryTree();
    await processBranchAndMerchant(
      branchFunction,
      merchantFunction,
      branchName
    );
    console.log(`\x1b[32m${branchName} process completed successfully.\x1b[0m`);
  } catch (error) {
    console.error(`Error in ${branchName} task execution:`, error);
  }
};

// Separate cron jobs for each branch and merchant
cron.schedule(
  "30 3 * * *", // Runs at 3:30 AM UK time
  async () => await taskRunner(BranchA, MerchantsA, "BranchA"),
  { timezone: timezone }
);

cron.schedule(
  "0 4 * * *", // Runs at 4:00 AM UK time
  async () => await taskRunner(BranchB, MerchantsB, "BranchB"),
  { timezone: timezone }
);

cron.schedule(
  "30 4 * * *", // Runs at 4:30 AM UK time
  async () => await taskRunner(BranchC, MerchantsC, "BranchC"),
  { timezone: timezone }
);

cron.schedule(
  "0 5 * * *", // Runs at 5:00 AM UK time
  async () => await taskRunner(BranchD, MerchantsD, "BranchD"),
  { timezone: timezone }
);

//! *--*-* testing
//! *--*-*

// Separate cron jobs for each branch and merchant with 30-minute gaps starting at 7:30 AM
cron.schedule(
  "30 7 * * *", // Runs at 7:30 AM UK time
  async () => await taskRunner(BranchA, MerchantsA, "BranchA"),
  { timezone: timezone }
);

cron.schedule(
  "0 8 * * *", // Runs at 8:00 AM UK time
  async () => await taskRunner(BranchB, MerchantsB, "BranchB"),
  { timezone: timezone }
);

cron.schedule(
  "30 8 * * *", // Runs at 8:30 AM UK time
  async () => await taskRunner(BranchC, MerchantsC, "BranchC"),
  { timezone: timezone }
);

cron.schedule(
  "0 9 * * *", // Runs at 9:00 AM UK time
  async () => await taskRunner(BranchD, MerchantsD, "BranchD"),
  { timezone: timezone }
);

// Run all tasks sequentially for testing
// (async () => {
//   try {
//     const branches = [
//       {
//         branchFunction: BranchA,
//         merchantFunction: MerchantsA,
//         name: "BranchA",
//       },
//       {
//         branchFunction: BranchB,
//         merchantFunction: MerchantsB,
//         name: "BranchB",
//       },
//       {
//         branchFunction: BranchC,
//         merchantFunction: MerchantsC,
//         name: "BranchC",
//       },
//       {
//         branchFunction: BranchD,
//         merchantFunction: MerchantsD,
//         name: "BranchD",
//       },
//     ];

//     for (const branch of branches) {
//       const startTime = new Date(); // Capture start time
//       console.log(
//         `Starting testing for ${branch.name} at ${startTime.toLocaleString()}`
//       );

//       await taskRunner(
//         branch.branchFunction,
//         branch.merchantFunction,
//         branch.name
//       );

//       const endTime = new Date(); // Capture end time
//       console.log(
//         `Completed testing for ${branch.name} at ${endTime.toLocaleString()}`
//       );
//     }
//   } catch (error) {
//     console.error(`Error in testing execution:`, error);
//   }
// })();

// Set up the server
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome - V1.0.1" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
