const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

module.exports = async (res) => {
    const userIdA = res.locals.user.id;

    _io.once('connection', (socket) => {
        // Gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            // Thêm id của user A vào danh sách bạn bè của user B
            const existAInB = await User.findOne({
                _id: userIdB,
                acceptFriends: userIdA
            });

            if (!existAInB) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $push: { acceptFriends: userIdA }
                });
            }

            // Thêm id của user B vào danh sách bạn bè của user A
            const existBInA = await User.findOne({
                _id: userIdA,
                requestFriends: userIdB
            });

            if (!existBInA) {
                await User.updateOne({
                    _id: userIdA
                }, {
                    $push: { requestFriends: userIdB }
                });
            }

            // Lấy độ dài acceptFriends của B trả về cho B
            const userB = await User.findOne({
                _id: userIdB
            });
            const lengthAcceptFriends = userB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // Lấy thông tin của A để trả về cho B
            const userA = await User.findOne({
                _id: userIdA
            }).select("fullName avatar");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userIdB: userIdB,
                userA: userA
            });
        })

        // Hủy gửi yêu cầu kết bạn
        socket.on('CLIENT_CANCEL_FRIREND', async (userIdB) => {
            // Xóa id của user A khỏi danh sách chấp nhận kết bạn của user B
            await User.updateOne({
                _id: userIdB
            }, {
                $pull: { acceptFriends: userIdA }
            });

            // Xóa id của user B khỏi danh sách yêu cầu của user A
            await User.updateOne({
                _id: userIdA
            }, {
                $pull: { requestFriends: userIdB }
            });

            // Lấy độ dài acceptFriends của B trả về cho B
            const userB = await User.findOne({
                _id: userIdB
            });
            const lengthAcceptFriends = userB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // Lấy id của A để trả về cho B
            socket.broadcast.emit("SERVER_RETURN_CANCEL_REQUEST", {
                userIdB: userIdB,
                userIdA: userIdA
            });
        })

        // Từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIREND", async (userIdB) => {
            // Xóa id của user B khỏi danh sách chấp nhận kết bạn của user A
            await User.updateOne({
                _id: userIdA
            }, {
                $pull: { acceptFriends: userIdB }
            });

            // Xóa id của user A khỏi danh sách yêu cầu của user B
            await User.updateOne({
                _id: userIdB
            }, {
                $pull: { requestFriends: userIdA }
            });
        })

        // Chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userIdB) => {
            // Tạo mới một phòng chat cho A và B
            const roomChat = new RoomChat({
                typeRoom: "friend",
                users: [
                    {
                        user_id: userIdA,
                        role: "superAdmin"
                    },
                    {
                        user_id: userIdB,
                        role: "superAdmin"
                    }
                ],
            });

            await roomChat.save();

            // Thêm {user_id, room_chat_id} của B vào friendsList của A
            // Xóa id của B trong acceptFriends của A
            await User.updateOne({
                _id: userIdA
            }, {
                $push: {
                    friendsList: {
                        user_id: userIdB,
                        room_chat_id: roomChat.id
                    }
                },
                $pull: { acceptFriends: userIdB }
            });

            // Thêm {user_id, room_chat_id} của A vào friendsList của B
            // Xóa id của A trong requestFriends của B
            await User.updateOne({
                _id: userIdB
            }, {
                $push: {
                    friendsList: {
                        user_id: userIdA,
                        room_chat_id: roomChat.id
                    }
                },
                $pull: { requestFriends: userIdA }
            });
        })
    });
}