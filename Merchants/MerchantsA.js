const {
  loginUser,
  getProductList,
  bulkDeleteProducts,
  hyperzodUpload,
  validateProductImport,
  importProductData,
} = require("../hyperzodAPI");

const MerchantsA = async () => {
  try {
    const token = `Bearer ${await loginUser()}`;
    const merchantId = "66f544b605f843b99b0fbff3";
    const page = 1;
    const pageLimit = 50000;

    const getProductListResult = await getProductList(
      page,
      pageLimit,
      token,
      merchantId
    );

    if (getProductListResult.length > 0) {
      await bulkDeleteProducts(getProductListResult, token, merchantId);
    }
    const uploadResult = await hyperzodUpload(token, "./BranchA.csv");
    if (!uploadResult || uploadResult.status_code !== 200) {
      throw new Error("Failed to upload CSV file");
    }

    const validationResult = await validateProductImport(
      uploadResult.data,
      token,
      merchantId
    );
    if (!validationResult || validationResult.status_code !== 200) {
      throw new Error("Product validation failed");
    }

    const importResult = await importProductData(
      validationResult.data,
      token,
      merchantId
    );
    if (!importResult || importResult.status_code !== 200) {
      throw new Error("Product import failed");
    }

    console.log(
      " =-=-=->> MerchantsA Product import successful:",
      importResult.message
    );
  } catch (error) {
    console.error("Error in CSV import process:", error.message);
  }
};

module.exports = MerchantsA;
