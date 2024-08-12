const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const productHelper = require('../../helpers/product');

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    });

    cart.totalPrice = 0;

    for (const item of cart.products) {
        const infoProduct = await Product.findOne({
            _id: item.product_id
        }).select("thumbnail title price discountPercentage stock slug");

        infoProduct.priceNew = productHelper.priceNewProduct(infoProduct);

        item.infoProduct = infoProduct;

        item.totalPrice = item.quantity * infoProduct.priceNew;

        cart.totalPrice += item.totalPrice;
    }

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const products = [];

    for (const item of cart.products) {
        const productInfo = await Product.findOne({
            _id: item.product_id
        });

        const objectProduct = {
            product_id: item.product_id,
            price: productInfo.price,
            discountPercentage: productInfo.discountPercentage,
            quantity: item.quantity,
        };

        products.push(objectProduct);

        // Update product quantity and status
        const newQuantity = productInfo.stock - item.quantity;

        if (newQuantity <= 0) {
            await Product.updateOne({
                _id: item.product_id
            }, {
                stock: 0,
                status: "inactive"
            });
        } else {
            await Product.updateOne({
                _id: item.product_id
            }, {
                stock: newQuantity
            });
        }
    }

    const dataOrder = {
        // user_id: String,
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
    };

    const order = new Order(dataOrder);
    await order.save();

    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findOne({
            _id: orderId
        });

        order.totalPrice = 0;

        for (const product of order.products) {
            const productInfo = await Product.findOne({
                _id: product.product_id
            });

            product.title = productInfo.title;
            product.thumbnail = productInfo.thumbnail;
            product.priceNew = productHelper.priceNewProduct(productInfo);
            product.totalPrice = product.priceNew * product.quantity;

            order.totalPrice += product.totalPrice;
        }

        res.render("client/pages/checkout/success", {
            pageTitle: "Đặt hàng thành công",
            order: order
        });
    } catch (error) {
        res.redirect("/");
    }
};