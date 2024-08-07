const Product = require('../../models/product.model');
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model")

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    // categoryProduct
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
        deleted: false
    });

    statistic.categoryProduct.active = await ProductCategory.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
        status: "inactive",
        deleted: false
    });
    // End categoryProduct


    // product
    statistic.product.total = await Product.countDocuments({
        deleted: false
    });

    statistic.product.active = await Product.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.product.inactive = await Product.countDocuments({
        status: "inactive",
        deleted: false
    });
    // End product

    // account
    statistic.account.total = await Account.countDocuments({
        deleted: false
    });

    statistic.account.active = await Account.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.account.inactive = await Account.countDocuments({
        status: "inactive",
        deleted: false
    });
    // End account

    res.render('admin/pages/dashboard/index', {
        pageTitle: 'Trang tổng quan',
        statistic: statistic
    })
}