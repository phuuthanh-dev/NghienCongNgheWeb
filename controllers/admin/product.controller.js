const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require("../../config/system");

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

    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort.position = "desc";
    }
    // End Sort

    const products = await Product
        .find(find)
        .limit(objectPagination.itemsPerPage)
        .skip(objectPagination.skip)
        .sort(sort);

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
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash('success', 'Cập nhật trạng thái thành công!');
            break;
        case 'inactive':
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash('success', 'Cập nhật trạng thái thành công!');
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true
            });
            req.flash('success', 'Xóa sản phẩm thành công!');
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash('success', 'Thay đổi vị trí sản phẩm thành công!');
            break;
        default:
            break;
    }
    res.redirect('back');
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        deleted: true
    });

    req.flash('success', `Xóa sản phẩm thành công!`);

    res.redirect('back');
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products/create', {
        pageTitle: 'Thêm sản phẩm'
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const highestPositionProduct = await Product.findOne().sort({ position: "desc" });
        req.body.position = highestPositionProduct ? highestPositionProduct.position + 1 : 1;
    }

    req.body.thumbnail = `/uploads/${req.file.filename}`;

    const newProduct = new Product(req.body);
    await newProduct.save();

    req.flash('success', `Thêm sản phẩm ${req.body.title} thành công!`);

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}