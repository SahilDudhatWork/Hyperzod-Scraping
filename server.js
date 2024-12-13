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

const express = require("express");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const app = express();
const {
  fetchCategoryTree,
  readCategoryTree,
} = require("./utils/fetchCategoryTree");

const BranchA = require("./Products/BranchA");
const BranchB = require("./Products/BranchB");
const BranchC = require("./Products/BranchC");
const BranchD = require("./Products/BranchD");
const MerchantsA = require("./Merchants/MerchantsA");
const MerchantsB = require("./Merchants/MerchantsB");
const MerchantsC = require("./Merchants/MerchantsC");
const MerchantsD = require("./Merchants/MerchantsD");

const PORT = process.env.PORT || 8080;
// const timezone = "Europe/London";
// const schedule = "0 4 * * *";
const timezone = "Asia/Kolkata"; // Indian Standard Time
const schedule = "50 15 * * *"; // 3:47 PM IST

const clearFiles = () => {
  const files = [
    "./BranchA.csv",
    "./BranchB.csv",
    "./BranchC.csv",
    "./BranchD.csv",
    "./Api-Log.json",
  ];
  files.forEach((file) => {
    try {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Error removing file ${file}:`, error.message);
    }
  });
};

const processSubCategories = async (categories, parentName) => {
  for (const category of categories) {
    await Promise.all([
      BranchA(category, parentName),
      BranchB(category, parentName),
      BranchC(category, parentName),
      BranchD(category, parentName),
    ]);
    if (category.subCategories.length > 0) {
      await processSubCategories(category.subCategories, parentName);
    }
  }
};

const test = async () => {
  try {
    console.log("Starting product import task...");
    await clearFiles();
    await fetchCategoryTree();

    const readCategoryTreeResult = await readCategoryTree();
    console.log("Fetched categories:", readCategoryTreeResult.length);

    for (const category of readCategoryTreeResult) {
      if (
        category.name !== "Tool Hire" &&
        category.name !== "Benchmarx Kitchens"
      ) {
        await processSubCategories(category.subCategories, category.name);
      }
    }

    await Promise.all([MerchantsA(), MerchantsB(), MerchantsC(), MerchantsD()]);
    console.log("All products successfully imported.");
  } catch (error) {
    console.error("Error during task execution:", error.message);
  }
};

cron.schedule(
  schedule,
  async () => {
    console.log("Cron job started");
    await test();
    console.log("Cron job completed");
  },
  { timezone }
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome - V1.0.1" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
