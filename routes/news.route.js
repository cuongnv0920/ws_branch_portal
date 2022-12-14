const express = require("express");
const router = express.Router();
const validator = require("../validators/news.validator");
const controller = require("../controllers/news.controller");
const upload = require("../config/storage.conf");

router.get("/getAll", controller.getAll);
router.get("/getFeatured", controller.getFeatured);
router.get("/get/:id", controller.get);
router.get("/detail/:id", controller.detail);
router.post(
  "/create",
  upload.fields([
    { name: "file_1", maxCount: 1 },
    { name: "file_2", maxCount: 1 },
  ]),
  validator.validatorCreate(),
  controller.create
);
router.put(
  "/update/:id",
  upload.fields([
    { name: "file_1", maxCount: 1 },
    { name: "file_2", maxCount: 1 },
  ]),
  validator.validatorUpdate(),
  controller.update
);
router.put("/delete/:id", controller.delete);

module.exports = router;
