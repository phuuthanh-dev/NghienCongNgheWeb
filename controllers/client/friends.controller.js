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
  const friendsList = res.locals.user.friendsList.map(user => user.user_id);

  // https://stackoverflow.com/questions/62206664/mongoose-query-to-find-based-on-multiple-not-equals
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendsList } }
    ],
    status: "active",
    deleted: false,
  }).select("avatar fullName slug");

  res.render("client/pages/friend/suggestion", {
    pageTitle: "Danh sách gợi ý",
    users: users
  });
};

// [GET] /friends/requests
module.exports.requests = async (req, res) => {
  // SocketIO
  await friendsSocket(res);
  // End SocketIO

  const requestFriends = res.locals.user.requestFriends;

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("avatar fullName slug");

  res.render("client/pages/friend/request", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
};

// [GET] /friends/accepts
module.exports.accepts = async (req, res) => {
  // SocketIO
  await friendsSocket(res);
  // End SocketIO

  const acceptFriends = res.locals.user.acceptFriends;

  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("avatar fullName slug");

  res.render("client/pages/friend/accept", {
    pageTitle: "Lời mời đã nhận",
    users: users
  });
};

// [GET] /friends
module.exports.index = async (req, res) => {
  const friendsListId = res.locals.user.friendsList.map(user => user.user_id);
  const myUnseenChats = res.locals.user.friendsList.map(user => user.unseenChats);

  const users = await User.find({
    _id: { $in: friendsListId },
    status: "active",
    deleted: false,
  }).select("avatar fullName statusOnline friendsList slug");

  users.forEach((user) => {
    const info = res.locals.user.friendsList.find(userFriend => userFriend.user_id == user.id);

    if (info) {
      user.room_chat_id = info.room_chat_id;
      user.unseenChats = info.unseenChats;
    }
  });

  res.render("client/pages/friend/index", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};