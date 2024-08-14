const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/room-chat.model");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;
    // Socket chat
    await chatSocket(req, res);
    // End socket chat

    const roomChat = await RoomChat.findOne({ _id: roomChatId, deleted: false });

    // Lấy data trong database
    const chats = await Chat.find({ room_chat_id: roomChatId, deleted: false });

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.userFullName = infoUser.fullName;
    }
    // Hết Lấy data trong database

    let title = '';
    let statusOnline = ''
    if (roomChat.typeRoom === 'group') {
        title = roomChat.title;
        statusOnline = 'online';
    } else {
        const otherUserId = roomChat.users.find(userId => userId.user_id != res.locals.user.id).user_id;
        const infoUser = await User.findOne({ _id: otherUserId }).select("fullName statusOnline");
        title = infoUser.fullName;
        statusOnline = infoUser.statusOnline
    }

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        title,
        chats,
        typeRoom: roomChat.typeRoom,
        statusOnline
    });
};