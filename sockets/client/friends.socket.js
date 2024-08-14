const User = require("../../models/user.model");

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
        })

        // Hủy gửi yêu cầu kết bạn
        socket.on('CLIENT_CANCEL_FRIREND', async (userIdB) => {
            console.log(userIdB);

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

            // Lấy id của A để trả về cho B
            socket.broadcast.emit("SERVER_RETURN_CANCEL_FRIEND", {
                userIdB: userIdB,
                userIdA: userIdA
            });
        })
    });
}