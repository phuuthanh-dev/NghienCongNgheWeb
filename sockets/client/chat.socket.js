const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/room-chat.model");
const User = require("../../models/user.model");

const { uploadToCloudinary } = require("../../helpers/uploadToCloudinary");

module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;

    _io.once('connection', (socket) => {
        socket.join(roomChatId);

        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const roomChat = await RoomChat.findOne({
                _id: roomChatId,
                deleted: false
            })

            if (data.userId != userId || !roomChat) {
                return;
            }

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

            if (roomChat.typeRoom === "friend") {
                const usersInRoom = roomChat.users;
                for (const user of usersInRoom) {
                    if (user.user_id !== userId) {
                        await User.updateOne(
                            {
                                _id: user.user_id,
                                "friendsList.room_chat_id": roomChatId
                            }, {
                            $inc: { "friendsList.$.unseenChats": 1 }
                        }
                        );

                        const userUnseen = await User.findOne({
                            _id: user.user_id,
                            "friendsList.room_chat_id": roomChatId
                        });

                        // Thông báo số lượng người có tin nhắn chưa đọc
                        const numberUserUnseen = userUnseen.friendsList.filter(friend => friend.unseenChats > 0).length

                        if (userUnseen && userUnseen.friendsList.length > 0) {
                            const friend = userUnseen.friendsList.find(entry => entry.room_chat_id === roomChatId);

                            if (friend) {
                                const unseenChatsCount = friend.unseenChats;

                                socket.broadcast.emit("SERVER_UNSEEN_CHATS", {
                                    userId: userUnseen.id,
                                    roomChatId: roomChatId,
                                    numberUnseenChats: unseenChatsCount,
                                    numberUserUnseen: numberUserUnseen
                                });
                            }
                        }

                    }
                }
            } else {
                const usersInRoom = roomChat.users;
                for (const user of usersInRoom) {
                    if (user.user_id !== userId) {
                        await RoomChat.updateOne(
                            {
                                _id: roomChatId,
                                "users.user_id": user.user_id
                            }, {
                            $inc: { "users.$.unseenChats": 1 }
                        });

                        socket.broadcast.emit("SERVER_UNSEEN_GROUP_CHATS", {
                            userId: user.user_id,
                            roomChatId: roomChatId,
                            unseenChats: user.unseenChats + 1
                        });
                    }
                }
            }

            _io.to(roomChatId).emit("SERVER_SEND_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images,
                typeRoom: roomChat.typeRoom
            })
        })

        socket.on("CLIENT_TYPING", (data) => {
            socket.to(roomChatId).emit("SERVER_TYPING", {
                userId: userId,
                fullName: fullName,
                roomChatId: roomChatId,
                status: data.status
            });
        })

        socket.on("CLIENT_SEEN_CHATS", async (data) => {
            const roomChat = await RoomChat.findOne({
                _id: roomChatId,
                deleted: false
            }).select("typeRoom");
            if (data.userId != userId || !roomChat) {
                return;
            }
            if (roomChat.typeRoom === "friend") {
                await User.updateOne(
                    {
                        _id: userId,
                        "friendsList.room_chat_id": roomChatId
                    }, {
                    $set: { "friendsList.$.unseenChats": 0 }
                });
            } else {
                await RoomChat.updateOne(
                    {
                        _id: roomChatId,
                        "users.user_id": userId
                    }, {
                    $set: { "users.$.unseenChats": 0 }
                });
            }
        })
    });
}