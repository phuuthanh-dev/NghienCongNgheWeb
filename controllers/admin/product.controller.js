module.exports.index = (req, res) => {
    res.render('admin/pages/products/index', {
        pageTitle: 'Danh sách sản phẩm'
    })
}