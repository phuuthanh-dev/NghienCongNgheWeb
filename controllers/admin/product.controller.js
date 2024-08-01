const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

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

    const products = await Product.find(find)
        .limit(objectPagination.itemsPerPage)
        .skip(objectPagination.skip);

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
            await Product.updateMany({ _id: { $in: ids }}, { status: "active" });
            break;
        case 'inactive':
            await Product.updateMany({ _id: { $in: ids }}, { status: "inactive" });
            break;
        default:
            break;
    }
    res.redirect('back');
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.deleteOne({
        _id: id
    });

    req.flash('success', `Xóa sản phẩm thành công!`);

    res.redirect('back');
}