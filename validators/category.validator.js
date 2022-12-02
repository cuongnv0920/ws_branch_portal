const { check } = require("express-validator");
const Category = require("../models/category.model");

const validatorCreate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Tên danh mục.")
      .custom((value) => {
        return Category.exists({ name: value })
          .where({ softDelete: "" })
          .then((category) => {
            if (category) {
              return Promise.reject(
                "Tên danh mục đã tồn tại, vui lòng nhập Tên danh mục khác."
              );
            }
          });
      }),
  ];
};

const validatorUpdate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Tên danh mục.")
      .custom((value, { req }) => {
        return Category.findOne({
          _id: { $ne: req.params.id },
          name: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((category) => {
            if (category) {
              return Promise.reject(
                "Tên danh mục đã tồn tại, vui lòng nhập Tên danh mục khác."
              );
            }
          });
      }),
  ];
};

const validator = {
  validatorCreate,
  validatorUpdate,
};

module.exports = validator;
