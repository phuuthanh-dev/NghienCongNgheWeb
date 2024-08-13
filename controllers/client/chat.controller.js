const User = require("../../models/user.model");


// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {

    res.render("client/pages/chat/index", {
        pageTitle: "Chat"
    });
};