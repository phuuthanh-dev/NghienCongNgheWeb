const User = require("../../models/user.model");

module.exports = async (res) => {
    const userIdA = res.locals.user.id;

    _io.once('connection', (socket) => {
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
    });
}