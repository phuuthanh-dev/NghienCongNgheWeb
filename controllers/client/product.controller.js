const Product = require('../../models/product.model');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    });
    
    const newProducts = products.map(product => {
        product.priceNew = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2);
        return product;
    })
    
    res.render('client/pages/products/index', {
        pageTitle: 'Danh sách sản phẩm',
        products: newProducts
    })
}