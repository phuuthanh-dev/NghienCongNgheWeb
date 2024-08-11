const ProductCategory = require("../../models/product-category.model");
const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product');
const productCategoryHelper = require('../../helpers/product-category');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = productHelper.priceNewProducts(products);

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

    if (product) {
        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });
            product.category = category;
        }

        product.priceNew = productHelper.priceNewProduct(product);
        
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } else {
        res.redirect("/products");
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
        slug: slugCategory,
        status: "active",
        deleted: false
    });

    const allSubCategoryId = (await productCategoryHelper.getSubCategory(category.id)).map(item => item.id);
    
    const products = await Product
        .find({
            product_category_id: {
                $in: [
                    category.id,
                    ...allSubCategoryId
                ]
            },
            status: "active",
            deleted: false
        })
        .sort({
            position: "desc"
        });

    for (const item of products) {
        item.priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
    }

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: products
    });
}