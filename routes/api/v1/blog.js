const express = require("express");
const router = express.Router();
const blogController = require("../../../controllers/api/v1/blog_controller");
const isAuthenticated = require("../../../config/isAuthenticated");

router.get("/", blogController.allPost);
router.get("/:id", blogController.singlePost);
router.post("/create", isAuthenticated, blogController.create);
router.delete("/delete/:id", isAuthenticated, blogController.delete);
router.put("/update/:id", isAuthenticated, blogController.update);

module.exports = router;
