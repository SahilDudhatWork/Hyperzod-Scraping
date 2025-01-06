const express = require("express");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const app = express();
const BranchA = require("./Controller/Products/BranchA");
const BranchB = require("./Controller/Products/BranchB");
const BranchC = require("./Controller/Products/BranchC");
const BranchD = require("./Controller/Products/BranchD");
const MerchantsA = require("./Controller/Merchants/MerchantsA");
const MerchantsB = require("./Controller/Merchants/MerchantsB");
const MerchantsC = require("./Controller/Merchants/MerchantsC");
const MerchantsD = require("./Controller/Merchants/MerchantsD");
const MB_A = require("./Controller/UpdateProduct/MB_A");
const MB_B = require("./Controller/UpdateProduct/MB_B");
const MB_C = require("./Controller/UpdateProduct/MB_C");
const MB_D = require("./Controller/UpdateProduct/MB_D");
const {
  fetchCategoryTree,
  readCategoryTree,
} = require("./utils/fetchCategoryTree");

const PORT = process.env.PORT || 8080;
const timezone = "Europe/London"; // Set timezone to UK

// Utility function to remove files
const cleanupFiles = async (files) => {
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

// // Separate cron jobs for each branch and merchant
// cron.schedule(
//   "30 3 * * 0", // Runs at 3:30 AM UK time every Sunday
//   async () => {
//     const files = ["./Temp/BranchA.csv", "./Temp/Api-Log.json"];
//     await cleanupFiles(files);
//     await taskRunner(BranchA, MerchantsA, "BranchA");
//   },
//   { timezone: timezone }
// );

// cron.schedule(
//   "0 4 * * 0", // Runs at 4:00 AM UK time every Sunday
//   async () => {
//     const files = ["./Temp/BranchB.csv", "./Temp/Api-Log.json"];
//     await cleanupFiles(files);
//     await taskRunner(BranchB, MerchantsB, "BranchB");
//   },
//   { timezone: timezone }
// );

// cron.schedule(
//   "30 4 * * 0", // Runs at 4:30 AM UK time every Sunday
//   async () => {
//     const files = ["./Temp/BranchC.csv", "./Temp/Api-Log.json"];
//     await cleanupFiles(files);
//     await taskRunner(BranchC, MerchantsC, "BranchC");
//   },
//   { timezone: timezone }
// );

// cron.schedule(
//   "0 5 * * 0", // Runs at 5:00 AM UK time every Sunday
//   async () => {
//     const files = ["./Temp/BranchD.csv", "./Temp/Api-Log.json"];
//     await cleanupFiles(files);
//     await taskRunner(BranchD, MerchantsD, "BranchD");
//   },
//   { timezone: timezone }
// );

cron.schedule("0 4 * * 1-6", async () => {
  console.log(
    "Running the cron job at 4:00 AM UK time (Mon-Sat) For Product Update"
  );
  await MB_A();
  await MB_B();
  await MB_C();
  await MB_D();
});

// Run all tasks sequentially for testing
(async () => {
  try {
    // const files = [
    //   "./Temp/BranchA.csv",
    //   "./Temp/BranchB.csv",
    //   "./Temp/BranchC.csv",
    //   "./Temp/BranchD.csv",
    //   "./Temp/Api-Log.json",
    // ];
    // await cleanupFiles(files);
    // const branches = [
    //   {
    //     branchFunction: BranchA,
    //     merchantFunction: MerchantsA,
    //     name: "BranchA",
    //   },
    //   {
    //     branchFunction: BranchB,
    //     merchantFunction: MerchantsB,
    //     name: "BranchB",
    //   },
    //   {
    //     branchFunction: BranchC,
    //     merchantFunction: MerchantsC,
    //     name: "BranchC",
    //   },
    //   {
    //     branchFunction: BranchD,
    //     merchantFunction: MerchantsD,
    //     name: "BranchD",
    //   },
    // ];
    // for (const branch of branches) {
    //   const startTime = new Date();
    //   console.log(
    //     `Starting testing for ${branch.name} at ${startTime.toLocaleString()}`
    //   );
    //   await taskRunner(
    //     branch.branchFunction,
    //     branch.merchantFunction,
    //     branch.name
    //   );
    //   const endTime = new Date();
    //   console.log(
    //     `Completed testing for ${branch.name} at ${endTime.toLocaleString()}`
    //   );
    // }
    await MB_A();
    await MB_B();
    await MB_C();
    await MB_D();
  } catch (error) {
    console.error(`Error in testing execution:`, error);
  }
})();

// Set up the server
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome - V1.0.1" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
