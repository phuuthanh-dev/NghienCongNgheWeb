const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/friends.controller");

router.get("/", controller.friends);

module.exports = router;