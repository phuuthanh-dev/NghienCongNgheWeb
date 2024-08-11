const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => {
    const subCategory = await ProductCategory.find({
        parent_id: parentId,
        status: "active",
        deleted: false
    });

    let allSubCategory = [...subCategory];

    for (const sub of subCategory) {
        const childs = await this.getSubCategory(sub.id);
        allSubCategory = allSubCategory.concat(childs);
    }

    return allSubCategory;
}