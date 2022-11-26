const { check } = require("express-validator");
const Category = require("../models/category.model");

const validatorCreate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Tên danh mục")
      .custom((value) => {
        return Category.exists({ name: value }).then((category) => {
          if (category) {
            return Promise.reject(
              "Tên danh mục đã tồn tại, vui lòng nhập Tên danh múc khác."
            );
          }
        });
      }),
  ];
};

const validator = {
  validatorCreate,
};

module.exports = validator;
