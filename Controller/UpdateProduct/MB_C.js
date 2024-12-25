const {
  loginUser,
  merchantC_GetProductList,
  searchProducts,
  updateProduct,
} = require("../hyperzodAPI");

const MB_C = async () => {
  try {
    const token = `Bearer ${await loginUser()}`;
    const merchantId = "66f67a9863e7cad5c0021c91";
    const pageLimit = 1000;
    const hzProducts = [];

    // Step 1: Fetch all hzProducts from merchant
    let page = 1;
    while (true) {
      const productList = await merchantC_GetProductList(
        page,
        pageLimit,
        token,
        merchantId
      );
      if (!productList || productList.length === 0) {
        console.log("MB_C: NO Products for delete.");
        break;
      }
      hzProducts.push(...productList);
      page++;
    }

    if (hzProducts.length === 0) {
      console.log("No hzProducts found to process.");
      return;
    }

    const stockCounts = [];
    let index = 0;
    for (const product of hzProducts) {
      const sku = product.sku.slice(0, 6);
      const [result] = await searchProducts(sku, ["0216", "SE15 6TH"]);
      index++;
      console.log(
        `MB_C -> Sku: ${product.sku} -> Qty: ${result} -> Match: ${
          result !== product.product_quantity.max_quantity
        } -> Index: ${index}`
      );

      if (result !== product.product_quantity.max_quantity) {
        stockCounts.push({
          product_id: product.product_id,
          stock_count: result,
        });
      }
    }
    if (stockCounts.length > 0) {
      const payload = {
        merchant_id: merchantId,
        stock_counts: stockCounts,
      };
      await updateProduct(payload, token);
    } else {
      console.log("MB_C -> No stock count to update.");
    }

    console.log("MB_C -> Total hzProducts :", hzProducts.length);
    console.log("MB_C -> Total stockCounts :", stockCounts.length);

    console.log(
      "\x1b[32m*=*=*=*=*=*=*=*=*=*/\x1b[0m \x1b[31m MB_C - All chunks processed successfully.\x1b[0m \x1b[32m/*=*=*=*=*=*=*=*=*=*\x1b[0m"
    );
  } catch (error) {
    console.error("Error in MB_C process:", error.message);
  }
};

module.exports = MB_C;
