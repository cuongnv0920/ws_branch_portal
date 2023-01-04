const express = require("express");
const router = express.Router();
const validator = require("../validators/margin.validator");
const controller = require("../controllers/margin.controller");
const middleware = require("../middlewares/margin.middleware");

router.get("/getAll", controller.getAll);
router.post(
  "/create",
  validator.validatorCreate(),
  controller.create,
  middleware.create
);
router.put(
  "/update/:id",
  validator.validatorUpdate(),
  controller.update,
  middleware.update
);
router.put("/delete/:id", controller.delete);

module.exports = router;
