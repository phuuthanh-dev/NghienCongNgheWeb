const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
const { uploadToCloudinary } = require("../../helpers/uploadToCloudinary");

// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];

            for (const imageBuffer of data.images) {
                const result = await uploadToCloudinary(imageBuffer);
                images.push(result);
            }

            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            });

            await chat.save();

            _io.emit("SERVER_SEND_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        })

        socket.on("CLIENT_TYPING", (status) => {
            socket.broadcast.emit("SERVER_TYPING", {
                userId: userId,
                fullName: fullName,
                status: status
            });
        })
    });

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