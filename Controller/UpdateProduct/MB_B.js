const {
  loginUser,
  merchantB_GetProductList,
  searchProducts,
  updateProduct,
} = require("../hyperzodAPI");
const fs = require("fs");
const path = require("path");

const MB_B = async () => {
  try {
    const token = `Bearer ${await loginUser()}`;
    const merchantId = "66feb0274ba29a6a3e0e2e8d";
    const pageLimit = 1000;
    const hzProducts = [];

    // Step 1: Fetch all hzProducts from merchant
    let page = 1;
    while (true) {
      const productList = await merchantB_GetProductList(
        page,
        pageLimit,
        token,
        merchantId
      );
      if (!productList || productList.length === 0) {
        console.log("MB_B: NO Products for delete.");
        break;
      }
      hzProducts.push(...productList);
      page++;
    }

    if (hzProducts.length === 0) {
      console.log("No hzProducts found to process.");
      return;
    }

    const jsonFilePath = path.join(__dirname, "../../Temp/JSON_BranchB.json");
    let readJson = await fs.readFileSync(jsonFilePath, "utf-8");
    readJson = JSON.parse(readJson);

    if (readJson.length === 0) {
      console.log("JSON_BranchB.json is empty.");
      return;
    }

    const notMatching = [];
    const stockCounts = [];
    let index = 0;
    for (const product of hzProducts) {
      const getProduct = readJson.find(
        (i) => i.randomTanDigitNumber == product.sku
      );
      const result = await searchProducts(getProduct.sku, ["0344", "SE15 6TH"]);
      index++;
      console.log(
        `MB_B -> Sku: ${product.sku} -> Qty: ${result} -> Match: ${
          result[0] !== product.product_quantity.max_quantity
        } -> Index: ${index}`
      );
      if (result.length > 1) {
        notMatching.push(`Sku: ${product.sku} -> Name: ${product.name}`);
      }

      if (result[0] !== product.product_quantity.max_quantity) {
        stockCounts.push({
          product_id: product.product_id,
          stock_count: result[0],
        });
      }
    }
    const payload = {
      merchant_id: merchantId,
      stock_counts: stockCounts,
    };
    await updateProduct(payload, token);

    console.log("MB_B -> notMatching :>> ", notMatching, notMatching.length);
    console.log("MB_B -> Total hzProducts fetched:", hzProducts.length);
    console.log("MB_B -> readJson.length :>> ", readJson.length);

    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31m MB_B - All chunks processed successfully.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error in MB_B process:", error.message);
  }
};

module.exports = MB_B;
