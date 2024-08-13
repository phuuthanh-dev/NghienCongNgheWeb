const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat
module.exports.index = async (req, res) => {
    // Socket chat
    await chatSocket(res);
    // End socket chat

    // Lấy data trong database
    const chats = await Chat.find({
        deleted: false
    });

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.userFullName = infoUser.fullName;
    }
    // Hết Lấy data trong database

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    });
};