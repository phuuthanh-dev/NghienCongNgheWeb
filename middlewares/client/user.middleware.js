const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");
const { set } = require("mongoose");

module.exports.infoUser = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            token: req.cookies.tokenUser,
            deleted: false,
            status: "active"
        }).select("-password");

        if (user) {
            const groupChats = await RoomChat.find({
                typeRoom: "group",
                "users.user_id": user.id,
            });

            res.locals.unseenGroupChats = groupChats.some(groupChat => {
                return groupChat.users.some(userInGroup =>
                    userInGroup.user_id == user.id && userInGroup.unseenChats > 0
                );
            });
            res.locals.user = user;

            _io.on('connection', async (socket) => {

                socket.on("disconnect", async () => {
                    await User.updateOne({
                        _id: user.id
                    }, {
                        $set: {
                            statusOnline: "offline"
                        }
                    });
                    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
                        userId: user.id,
                        statusOnline: "offline"
                    })
                });
                await User.updateOne({
                    _id: user.id
                }, {
                    $set: {
                        statusOnline: "online"
                    }
                });
                socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
                    userId: user.id,
                    statusOnline: "online"
                })
            })
        }
    }

    next();
}