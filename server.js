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

// process.env.TZ = "Europe/London"; // Set timezone to UK time

// cron.schedule("0 6 * * *", async () => {
//   try {
//     console.log("Running a task every day at 6 AM UK time");
//     const csvFilePathBranchA = path.join(__dirname, "./BranchA.csv");
//     const csvFilePathBranchB = path.join(__dirname, "./BranchB.csv");
//     const csvFilePathBranchC = path.join(__dirname, "./BranchC.csv");
//     const csvFilePathBranchD = path.join(__dirname, "./BranchD.csv");

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

//     await fetchCategoryTree();
//     await new Promise((resolve) => setTimeout(resolve, 5000));

//     const readCategoryTreeResult = await readCategoryTree();
//     console.log(
//       "readCategoryTreeResult.length :>> ",
//       readCategoryTreeResult.length
//     );

//     let index = 0;
//     for (const item of readCategoryTreeResult) {
//       if (item.subCategories.length > 0) {
//         for (const category of item.subCategories) {
//           await BranchA(category);
//           await BranchB(category);
//           await BranchC(category);
//           await BranchD(category);
//         }
//         index++;
//         console.log("*=*=*=*=*=*=*=*=*=*=*=*= :>> ", index);
//       }
//     }

//     await MerchantsA();
//     await new Promise((resolve) => setTimeout(resolve, 9000));
//     await MerchantsB();
//     await new Promise((resolve) => setTimeout(resolve, 9000));
//     await MerchantsC();
//     await new Promise((resolve) => setTimeout(resolve, 9000));
//     await MerchantsD();
//     console.log(
//       "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31mAll Products successfully Imported.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
//     );
//   } catch (error) {
//     console.error("Error during initial execution:", error);
//   }
// });

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "WelCome - V1.0.1" });
// });

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

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

process.env.TZ = "Europe/London"; // Set timezone to UK time for the first cron job
const ukCronSchedule = "0 6 * * *"; // UK cron job at 6 AM
const indiaCronSchedule = "5 17 * * *"; // Indian cron job at 5:05 PM (17:05 in 24-hour format)

// UK cron job
cron.schedule(ukCronSchedule, async () => {
  try {
    console.log("Running a task every day at 6 AM UK time");
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

// Indian cron job
process.env.TZ = "Asia/Kolkata"; // Set timezone to India for the second cron job
cron.schedule(indiaCronSchedule, async () => {
  try {
    console.log("Running a task every day at 5:05 PM India time");
    // Add the specific task to be executed at this time
  } catch (error) {
    console.error("Error during India execution:", error);
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "WelCome - V1.0.1" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
