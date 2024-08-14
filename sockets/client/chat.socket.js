const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/room-chat.model");

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

            const roomChat = await RoomChat.findOne({
                _id: roomChatId,
                deleted: false
            });

            _io.to(roomChatId).emit("SERVER_SEND_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images,
                typeRoom: roomChat.typeRoom
            })
        })

        socket.on("CLIENT_TYPING", async (status) => {
            socket.broadcast.to(roomChatId).emit("SERVER_TYPING", {
                userId: userId,
                fullName: fullName,
                status: status
            });
        })
    });
}