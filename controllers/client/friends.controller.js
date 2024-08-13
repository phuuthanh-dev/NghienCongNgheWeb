const User = require("../../models/user.model");

// [GET] /friends
module.exports.friends = async (req, res) => {

  const userId = res.locals.user.id;

  const users = await User.find({
    _id: { $ne: userId },
    status: "active",
    deleted: false,
  }).select("avatar fullName");

  res.render("client/pages/friend/not-friend", {
    pageTitle: "Danh sách gợi ý",
    users: users
  });
};