const Account = require("../../models/account.model")

// [GET] /admin/profile
module.exports.index = (req, res) => {
    res.render("admin/pages/profile/index", {
        pageTitle: "Thông tin cá nhân"
    });
}

// [GET] /admin/profile/edit
module.exports.edit = (req, res) => {
    res.render("admin/pages/profile/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    });
}

// [PATCH] /admin/profile/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.account.id;
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
    res.redirect("back");
}