const {
  loginUser,
  merchantD_GetProductList,
  searchProducts,
  updateProduct,
} = require("../hyperzodAPI");
const fs = require("fs");
const path = require("path");

const MB_D = async () => {
  try {
    const token = `Bearer ${await loginUser()}`;
    const merchantId = "66f67d6105f843b99b0fc062";
    const pageLimit = 1000;
    const hzProducts = [];

    // Step 1: Fetch all hzProducts from merchant
    let page = 1;
    while (true) {
      const productList = await merchantD_GetProductList(
        page,
        pageLimit,
        token,
        merchantId
      );
      if (!productList || productList.length === 0) {
        console.log("MB_D: NO Products for delete.");
        break;
      }
      hzProducts.push(...productList);
      page++;
    }

    if (hzProducts.length === 0) {
      console.log("No hzProducts found to process.");
      return;
    }

    const jsonFilePath = path.join(__dirname, "../../Temp/JSON_BranchD.json");
    let readJson = await fs.readFileSync(jsonFilePath, "utf-8");
    readJson = JSON.parse(readJson);

    if (readJson.length === 0) {
      console.log("JSON_BranchD.json is empty.");
      return;
    }

    const notMatching = [];
    const stockCounts = [];
    let index = 0;
    for (const product of hzProducts) {
      const getProduct = readJson.find(
        (i) => i.randomTanDigitNumber == product.sku
      );
      const result = await searchProducts(getProduct.sku, ["0212", "SE15 6TH"]);
      index++;
      console.log(
        `MB_D -> Sku: ${product.sku} -> Qty: ${result} -> Match: ${
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

    console.log("MB_D -> notMatching :>> ", notMatching, notMatching.length);
    console.log("MB_D -> Total hzProducts fetched:", hzProducts.length);
    console.log("MB_D -> readJson.length :>> ", readJson.length);

    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31m MB_D - All chunks processed successfully.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error in MB_D process:", error.message);
  }
};

module.exports = MB_D;
