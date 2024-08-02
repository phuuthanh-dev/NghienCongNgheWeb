const Product = require('../../models/product.model');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = products.map(product => {
        product.priceNew = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2);
        return product;
    })

    res.render('client/pages/products/index', {
        pageTitle: 'Danh sách sản phẩm',
        products: newProducts
    })
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;

    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    });

    product.priceNew = ((1 - product.discountPercentage / 100) * product.price).toFixed(0);

    if (product) {
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } else {
        res.redirect("/");
    }
}