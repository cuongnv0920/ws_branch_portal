const express = require("express");
const router = express.Router();
const validator = require("../validators/deposit.validator");
const controller = require("../controllers/deposit.controller");

router.get("/getAll", controller.getAll);
router.post("/create", validator.validatorCreate(), controller.create);
router.put("/update/:id", validator.validatorUpdate(), controller.update);
router.put("/delete/:id", controller.delete);
router.put("/effect", controller.effect);

module.exports = router;
