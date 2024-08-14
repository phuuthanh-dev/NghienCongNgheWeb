const Chat = require("../../models/chat.model");

const { uploadToCloudinary } = require("../../helpers/uploadToCloudinary");

module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;

    _io.once('connection', (socket) => {
        socket.join(roomChatId);

        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];

            for (const imageBuffer of data.images) {
                const result = await uploadToCloudinary(imageBuffer);
                images.push(result);
            }

            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatId,
                content: data.content,
                images: images
            });

            await chat.save();

            _io.to(roomChatId).emit("SERVER_SEND_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        })

        socket.on("CLIENT_TYPING", (status) => {
            socket.broadcast.to(roomChatId).emit("SERVER_TYPING", {
                userId: userId,
                fullName: fullName,
                status: status
            });
        })
    });
}