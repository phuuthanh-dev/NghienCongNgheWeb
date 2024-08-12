const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");

const md5 = require('md5')

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existUser = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if (existUser) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }

  const userInfo = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password)
  };

  const user = new User(userInfo);
  await user.save();

  res.cookie("tokenUser", user.token);

  req.flash("success", "Đăng ký tài khoản thành công, vui lòng đăng nhập!");
  res.redirect("/user/login");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }

  await Cart.updateOne({
    _id: req.cookies.cartId
  }, {
    user_id: user.id
  });

  res.cookie("tokenUser", user.token);

  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  
  req.flash("success", "Đăng xuất thành công!");
  res.redirect("/");
};


// [GET] /user/profile
module.exports.profile = async (req, res) => {
  const infoUser = await User.findOne({
    token: req.cookies.tokenUser,
    deleted: false
  }).select("-password");

  console.log(infoUser);

  res.render("client/pages/user/profile", {
    pageTitle: "Thông tin tài khoản",
    infoUser: infoUser
  });
};