const express = require("express");
const router = express.Router();
const validator = require("../validators/link.validator");
const controller = require("../controllers/link.controller");

router.get("/list", controller.list);
router.post("/create", validator.validatorCreate(), controller.create);
router.put("/update/:id", validator.validatorUpdate(), controller.update);
router.put("/delete/:id", controller.delete);

module.exports = router;