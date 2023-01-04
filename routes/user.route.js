const express = require("express");
const router = express.Router();
const validator = require("../validators/user.validator");
const controller = require("../controllers/user.controller");

router.get("/getAll", controller.getAll);
router.get("/getContact", controller.getContact);
router.post("/create", validator.validatorCreate(), controller.create);
router.put("/update/:id", validator.validatorUpdate(), controller.update);
router.put("/delete/:id", controller.delete);

router.post("/login", controller.login);

module.exports = router;
