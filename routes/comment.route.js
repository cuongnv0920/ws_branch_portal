const express = require("express");
const router = express.Router();
const controller = require("../controllers/comment.controller");
const middleware = require("../middlewares/comment.middleware");

router.get("/list", controller.list);
router.get("/get/:id", controller.get);
router.post("/create", controller.create, middleware.create);
router.put("/update/:id", controller.update);
router.put("/delete/:id", controller.delete, middleware.delete);

module.exports = router;
