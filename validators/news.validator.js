const { check } = require("express-validator");
const News = require("../models/news.model");

const validatorCreate = () => {
  return [
    check("title")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập tiêu đề bài viết."),
  ];
};

const validatorUpdate = () => {
  return [
    check("title")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập tiêu đề bài viết."),
  ];
};

const validator = {
  validatorCreate,
  validatorUpdate,
};

module.exports = validator;
