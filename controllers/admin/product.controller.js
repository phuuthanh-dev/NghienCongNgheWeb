const Product = require('../../models/product.model')
const Account = require("../../models/account.model")
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    // Filter status
    const filterStatus = filterStatusHelper(req);

    if (req.query.status) {
        find.status = req.query.status;
    }
    // End Filter status

    // Search
    const objectSearch = searchHelper(req);

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }
    // End Search

    // Pagination
    const countDocuments = await Product.countDocuments(find);
    const objectPagination = paginationHelper(
        { itemsPerPage: 4, currentPage: 1 },
        req,
        countDocuments
    );
    // End Pagination

    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // End Sort

    const products = await Product
        .find(find)
        .limit(objectPagination.itemsPerPage)
        .skip(objectPagination.skip)
        .sort(sort);

    for (const item of products) {
        // Người tạo
        if (item.createdBy) {
            const accountCreated = await Account.findOne({
                _id: item.createdBy.account_id
            });
            item.createdByFullName = accountCreated.fullName;
        } else {
            item.createdByFullName = "";
        }

        // Người cập nhật
        if (item.updatedBy) {
            const accountUpdated = await Account.findOne({
                _id: item.updatedBy
            });
            item.updatedByFullName = accountUpdated.fullName;
        } else {
            item.updatedByFullName = "";
        }
    }

    res.render('admin/pages/products/index', {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        objectPagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        status: status
    });

    const infoProduct = await Product.findOne({
        _id: id
    });

    req.flash('success', `Cập nhật trạng thái sản phẩm ${infoProduct.title} thành công!`);

    res.redirect(`back`);
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    let ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash('success', 'Cập nhật trạng thái thành công!');
            break;
        case 'inactive':
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash('success', 'Cập nhật trạng thái thành công!');
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.account.id,
                    deletedAt: new Date()
                }
            });
            req.flash('success', 'Xóa sản phẩm thành công!');
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash('success', 'Thay đổi vị trí sản phẩm thành công!');
            break;
        default:
            break;
    }
    res.redirect('back');
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.account.id,
            deletedAt: new Date()
        }
    });

    req.flash('success', `Xóa sản phẩm thành công!`);

    res.redirect('back');
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const categories = await ProductCategory.find({
        deleted: false
    });

    const newCategories = createTreeHelper(categories);

    res.render('admin/pages/products/create', {
        pageTitle: 'Thêm sản phẩm',
        categories: newCategories
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    if (res.locals.role.permissions.includes("products_create")) {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);

        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const highestPositionProduct = await Product.findOne().sort({ position: "desc" });
            req.body.position = highestPositionProduct ? highestPositionProduct.position + 1 : 1;
        }

        req.body.createdBy = {
            account_id: res.locals.account.id
        }

        const newProduct = new Product(req.body);
        await newProduct.save();

        req.flash('success', `Thêm sản phẩm ${req.body.title} thành công!`);
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false
        });

        if (product) {
            const categories = await ProductCategory.find({
                deleted: false
            });

            const newCategories = createTreeHelper(categories);

            res.render("admin/pages/products/edit", {
                pageTitle: "Chỉnh sửa sản phẩm",
                product: product,
                categories: newCategories
            });
        } else {
            req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
            res.redirect(`${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("products_edit")) {
        try {
            const id = req.params.id;

            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            req.body.position = parseInt(req.body.position);

            req.body.updatedBy = res.locals.account.id;

            await Product.updateOne({ _id: id }, req.body);

            req.flash('success', `Chỉnh sửa sản phẩm thành công!`);
        } catch (error) {
            req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        }
        res.redirect(`back`);
    }
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false
        });

        if (product) {
            const productCategory = await ProductCategory.findOne({
                _id: product.product_category_id
            });

            res.render("admin/pages/products/detail", {
                pageTitle: product.title,
                product: product,
                productCategory: productCategory
            });
        } else {
            res.redirect(`${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}