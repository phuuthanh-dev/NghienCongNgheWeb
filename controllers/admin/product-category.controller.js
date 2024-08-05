const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/product-categories
module.exports.index = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false
  });

  res.render("admin/pages/product-categories/index", {
    pageTitle: "Danh mục sản phẩm",
    categories: categories
  });
}

// [GET] /admin/product-categories/create
module.exports.create = async (req, res) => {

  res.render("admin/pages/product-categories/create", {
    pageTitle: "Thêm mới danh mục sản phẩm"
  });
}

// [POST] /admin/product-categories/create
module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const highestPositionCategory = await ProductCategory.findOne().sort({ position: "desc" });
    req.body.position = highestPositionCategory ? highestPositionCategory.position + 1 : 1;
  }

  const newCategory = new ProductCategory(req.body);
  await newCategory.save();

  res.redirect(`${systemConfig.prefixAdmin}/product-categories`);
}