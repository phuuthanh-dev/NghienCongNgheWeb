module.exports.priceNewProducts = (products) => {
    for (const item of products) {
        item.priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
    }
    return products;
}

module.exports.priceNewProduct = (product) => {
    return ((1 - product.discountPercentage / 100) * product.price).toFixed(0);
}