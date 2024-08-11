const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/product-categories
module.exports.index = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false
  });

  const newCategories = createTreeHelper(categories);

  res.render("admin/pages/product-categories/index", {
    pageTitle: "Danh mục sản phẩm",
    categories: newCategories
  });
}

// [GET] /admin/product-categories/create
module.exports.create = async (req, res) => {
  try {
    const categories = await ProductCategory.find({
      deleted: false
    });

    const newCategories = createTreeHelper(categories);

    res.render("admin/pages/product-categories/create", {
      pageTitle: "Thêm mới danh mục sản phẩm",
      categories: newCategories
    });
  } catch (error) {
    res.render("admin/pages/product-categories/create", {
      pageTitle: "Thêm mới danh mục sản phẩm",
      categories: []
    });
  }
}

// [POST] /admin/product-categories/create
module.exports.createPost = async (req, res) => {
  if (!res.locals.role.permissions.includes("product-categories_create")) {
    res.send("Không có quyền truy cập.");
    return;
  }

  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const highestPositionCategory = await ProductCategory.findOne().sort({ position: "desc" });
    req.body.position = highestPositionCategory ? highestPositionCategory.position + 1 : 1;
  }

  const newCategory = new ProductCategory(req.body);
  await newCategory.save();

  req.flash('success', `Thêm danh mục ${newCategory.title} thành công!`);
  res.redirect(`${systemConfig.prefixAdmin}/product-categories`);
}

// [GET] /admin/product-categories/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });

    const categories = await ProductCategory.find({
      deleted: false
    });

    const newCategories = createTreeHelper(categories);

    res.render("admin/pages/product-categories/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      category: category,
      categories: newCategories
    });
  } catch (error) {
    req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    res.redirect(`${systemConfig.prefixAdmin}/product-categories`);
  }
}

// [PATCH] /admin/product-categories/edit/:id
module.exports.editPatch = async (req, res) => {
  if (!res.locals.role.permissions.includes("products-categories_edit")) {
    res.send("Không có quyền truy cập.");
    return;
  }
  const id = req.params.id;

  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    req.body.position = category.position;
  }

  await ProductCategory.updateOne({ _id: id, deleted: false }, req.body);

  req.flash('success', `Cập nhật danh mục thành công!`);
  res.redirect(`back`);
}