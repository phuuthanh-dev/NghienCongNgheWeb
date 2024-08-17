const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;

    const listRoomChat = await RoomChat.find({
        "users.user_id": userId,
        typeRoom: "group",
        deleted: false
    });

    for (const roomChat of listRoomChat) {
        const users = roomChat.users;
        for (const user of users) {
            if (user.user_id == userId && user.unseenChats > 0) {
                roomChat.unseenChats = user.unseenChats;
            }
        }
    }

    res.render("client/pages/rooms-chat/index", {
        pageTitle: "Danh sách phòng",
        listRoomChat: listRoomChat
    });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const friendsList = res.locals.user.friendsList;

    for (const friend of friendsList) {
        const infoFriend = await User.findOne({
            _id: friend.user_id
        }).select("fullName avatar");
        friend.infoFriend = infoFriend;
    }

    res.render("client/pages/rooms-chat/create", {
        pageTitle: "Tạo phòng",
        friendsList: friendsList
    });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const usersId = req.body.usersId;

    const dataRoomChat = {
        title: title,
        avatar: "/images/avatar-room.png",
        typeRoom: "group",
        users: []
    };

    usersId.forEach(userId => {
        dataRoomChat.users.push({
            user_id: userId,
            role: "member"
        });
    })

    dataRoomChat.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    });

    const roomChat = new RoomChat(dataRoomChat);
    await roomChat.save();

    res.redirect(`/chat/${roomChat.id}`);
}