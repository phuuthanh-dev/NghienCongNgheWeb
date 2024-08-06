const Role = require("../../models/role.model")
const Account = require("../../models/account.model")

const md5 = require('md5')

const systemConfig = require("../../config/system")

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const accounts = await Account.find({
        deleted: false
    });

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