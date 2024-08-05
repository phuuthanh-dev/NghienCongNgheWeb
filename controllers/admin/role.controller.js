const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        roles: roles
    });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo mới nhóm quyền",
    });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const role = new Role(req.body);
    await role.save();

    req.flash('success', `Thêm nhóm quyền ${req.body.title} thành công!`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};