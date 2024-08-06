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
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const role = new Role(req.body);
    await role.save();

    req.flash('success', `Thêm nhóm quyền ${req.body.title} thành công!`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const role = await Role.findOne({
            _id: id,
            deleted: false
        });

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            role: role
        });
    } catch (error) {
        req.flash("error", "Nhóm quyền không tồn tại!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật thành công!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        roles: roles
    });
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const roles = JSON.parse(req.body.permissions); // Array of role objects with id and permissions properties

        for (const role of roles) {
            await Role.updateOne({
                _id: role.id,
                deleted: false
            }, {
                permissions: role.permissions
            });
        }

        req.flash("success", "Phân quyền thành công!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Phân quyền thất bại!");
        res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
    }
}