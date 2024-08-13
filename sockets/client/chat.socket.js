const Chat = require("../../models/chat.model");

const { uploadToCloudinary } = require("../../helpers/uploadToCloudinary");

module.exports = async (res) => {
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
}