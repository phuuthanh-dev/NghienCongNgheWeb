const e = require("express");
const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        const expiresTime = 1000 * 60 * 60 * 24 * 365;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });
        if (cart) {
            res.locals.miniCart = cart;
        } else {
            const cart = new Cart();
            await cart.save();

            const expiresTime = 1000 * 60 * 60 * 24 * 365;

            res.cookie("cartId", cart.id, {
                expires: new Date(Date.now() + expiresTime)
            });
        }
    }
    next();
}