const express = require("express");
const router = express.Router();

const controller = require("../controllers/exchangeRate.controller");

router.get("/list", controller.list);

module.exports = router;
