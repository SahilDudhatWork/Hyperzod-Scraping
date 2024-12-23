const {
  loginUser,
  merchantA_GetProductList,
  searchProducts,
  updateProduct,
} = require("../hyperzodAPI");
const fs = require("fs");
const path = require("path");

const MB_A = async () => {
  try {
    const token = `Bearer ${await loginUser()}`;
    const merchantId = "66f544b605f843b99b0fbff3";
    const pageLimit = 1000;
    const hzProducts = [];

    // Step 1: Fetch all hzProducts from merchant
    let page = 1;
    while (true) {
      const productList = await merchantA_GetProductList(
        page,
        pageLimit,
        token,
        merchantId
      );
      if (!productList || productList.length === 0) {
        console.log("MB_A: NO Products for delete.");
        break;
      }
      hzProducts.push(...productList);
      page++;
    }

    if (hzProducts.length === 0) {
      console.log("No hzProducts found to process.");
      return;
    }

    const jsonFilePath = path.join(__dirname, "../../Temp/JSON_BranchA.json");
    let readJson = await fs.readFileSync(jsonFilePath, "utf-8");
    readJson = JSON.parse(readJson);

    if (readJson.length === 0) {
      console.log("JSON_BranchA.json is empty.");
      return;
    }

    const notMatching = [];
    const stockCounts = [];
    let index = 0;
    for (const product of hzProducts) {
      const getProduct = readJson.find(
        (i) => i.randomTanDigitNumber == product.sku
      );
      const result = await searchProducts(getProduct.sku, ["0320"]);
      index++;
      console.log(
        `MB_A -> Sku: ${product.sku} -> Qty: ${result} -> Match: ${
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

    console.log("MB_A -> notMatching :>> ", notMatching, notMatching.length);
    console.log("MB_A -> Total hzProducts fetched:", hzProducts.length);
    console.log("MB_A -> readJson.length :>> ", readJson.length);

    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31m MB_A - All chunks processed successfully.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error in MB_A process:", error.message);
  }
};

module.exports = MB_A;
