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
const PORT = process.env.PORT || 3000;

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running a task every 24 hours at midnight");
    const csvFilePathBranchA = path.join(__dirname, "./BranchA.csv");
    const csvFilePathBranchB = path.join(__dirname, "./BranchB.csv");
    const csvFilePathBranchC = path.join(__dirname, "./BranchC.csv");
    const csvFilePathBranchD = path.join(__dirname, "./BranchD.csv");

    if (fs.existsSync(csvFilePathBranchA)) {
      fs.unlinkSync(csvFilePathBranchA);
      console.log("Existing BranchA file removed.");
    }
    if (fs.existsSync(csvFilePathBranchB)) {
      fs.unlinkSync(csvFilePathBranchB);
      console.log("Existing BranchB file removed.");
    }
    if (fs.existsSync(csvFilePathBranchC)) {
      fs.unlinkSync(csvFilePathBranchC);
      console.log("Existing BranchC file removed.");
    }
    if (fs.existsSync(csvFilePathBranchD)) {
      fs.unlinkSync(csvFilePathBranchD);
      console.log("Existing BranchD file removed.");
    }

    await fetchCategoryTree();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const readCategoryTreeResult = await readCategoryTree();
    console.log(
      "readCategoryTreeResult.length :>> ",
      readCategoryTreeResult.length
    );

    let index = 0;
    for (const item of readCategoryTreeResult) {
      if (item.subCategories.length > 0) {
        for (const category of item.subCategories) {
          await BranchA(category);
          await BranchB(category);
          await BranchC(category);
          await BranchD(category);
        }
        index++;
        console.log("*=*=*=*=*=*=*=*=*=*=*=*= :>> ", index);
      }
    }

    await MerchantsA();
    await new Promise((resolve) => setTimeout(resolve, 9000));
    await MerchantsB();
    await new Promise((resolve) => setTimeout(resolve, 9000));
    await MerchantsC();
    await new Promise((resolve) => setTimeout(resolve, 9000));
    await MerchantsD();
    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31mAll Products successfully Imported.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error during initial execution:", error);
  }
});
// (async () => {})();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
