const Role = require("../../models/role.model")
const Account = require("../../models/account.model")

const md5 = require('md5')

const systemConfig = require("../../config/system")

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const accounts = await Account.find({
        deleted: false
    }).select("-password -token");

    for (const account of accounts) {
        const role = await Role.findOne({
            _id: account.role_id,
            deleted: false
        });

        account.roleTitle = role.title;
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        accounts: accounts
    });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    }).select("title");

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo tài khoản",
        roles: roles
    });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExist) {
        req.flash("error", `Email ${emailExist.email} đã tồn tại`);
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password);

    const account = new Account(req.body);
    await account.save();

    req.flash("success", "Tạo tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}


// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const account = await Account.findOne({
            _id: id,
            deleted: false
        });

        const roles = await Role.find({
            deleted: false
        }).select("title");

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chinh sửa tài khoản",
            roles: roles,
            account: account
        });
    }
    catch (error) {
        req.flash("error", "Tài khoản không tồn tại");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        const emailExist = await Account.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            req.flash("error", `Email ${emailExist.email} đã tồn tại`);
            res.redirect("back");
            return;
        }

        if (req.body.password == "") {
            delete req.body.password;
        } else {
            req.body.password = md5(req.body.password);
        }

        await Account.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật thành công!");
    } catch (error) {
        req.flash("error", "Tài khoản không tồn tại");
    }
    res.redirect("back");
}