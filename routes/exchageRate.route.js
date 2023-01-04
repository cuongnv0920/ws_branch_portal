const express = require("express");
const router = express.Router();

const controller = require("../controllers/exchangeRate.controller");

router.get("/getAll", controller.getAll);

module.exports = router;
