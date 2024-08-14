const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/friends.controller");

router.get("/suggestions", controller.suggestions);

router.get("/requests", controller.requests);

router.get("/accepts", controller.accepts);

module.exports = router;