const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/api/v1/user_controller");
const isAuthenticated = require("../../../config/isAuthenticated");

router.post("/signin", userController.signin);
router.post("/signup", userController.signup);
router.put("/updateProfile/:id", isAuthenticated, userController.updateProfile);

module.exports = router;
