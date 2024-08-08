const express = require("express");
const multer = require('multer')
const router = express.Router();

const controller = require("../../controllers/admin/profile.controller");
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')

const upload = multer()

router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch("/edit", upload.single('avatar'), uploadCloud.upload, controller.editPatch);

module.exports = router;