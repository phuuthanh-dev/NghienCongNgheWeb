const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product');

// [GET] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product
        .find({
            featured: "1",
            status: "active",
            deleted: false
        })
        .sort({ position: "desc" })
        .limit(6)
        .select("-description");

    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);

    const productsNew = await Product
        .find({
            status: "active",
            deleted: false
        })
        .sort({ position: "desc" })
        .limit(6)
        .select("-description");

    const newProductsNew = productHelper.priceNewProducts(productsNew);

    res.render('client/pages/home/index', {
        pageTitle: 'Trang chủ',
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
}