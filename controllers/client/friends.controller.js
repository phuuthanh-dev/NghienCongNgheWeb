const User = require("../../models/user.model");

const friendsSocket = require("../../sockets/client/friends.socket");

// [GET] /friends/suggestions
module.exports.suggestions = async (req, res) => {
  // Socket chat
  await friendsSocket(res);
  // End socket chat

  const userId = res.locals.user.id;
  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;

  // https://stackoverflow.com/questions/62206664/mongoose-query-to-find-based-on-multiple-not-equals
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } }
    ],
    status: "active",
    deleted: false,
  }).select("avatar fullName");

  res.render("client/pages/friend/suggestion", {
    pageTitle: "Danh sách gợi ý",
    users: users
  });
};