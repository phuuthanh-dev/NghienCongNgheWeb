const express = require("express");
const multer = require('multer')
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require('../../validates/client/user.validate')
const authMiddleware = require("../../middlewares/client/auth.middleware");
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')

const upload = multer()

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);

router.post("/password/forgot", validate.forgotPasswordPost, controller.forgotPasswordPost);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post("/password/reset", validate.resetPasswordPost, controller.resetPasswordPost);

router.get("/profile", authMiddleware.requireAuth, controller.myProfile);

router.get("/profile/edit", authMiddleware.requireAuth, controller.editProfile);

router.get("/profile/:userId", authMiddleware.requireAuth, controller.profile);

router.patch("/profile/edit", upload.single('avatar'), uploadCloud.upload, authMiddleware.requireAuth, controller.editProfilePatch);

module.exports = router;