const express = require("express");
const router = express.Router();
const validator = require("../validators/category.validator");
const controller = require("../controllers/category.controller");

router.get("/list", controller.list);
router.post("/create", validator.validatorCreate(), controller.create);

module.exports = router;
