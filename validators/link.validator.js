const { check } = require("express-validator");
const Link = require("../models/link.model");

const validatorCreate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Tên liên kết.")
      .custom((value) => {
        return Link.exists({ name: value })
          .where({ softDelete: "" })
          .then((link) => {
            if (link) {
              return Promise.reject(
                "Tên liên kết đã tồn tại, vui lòng nhập Tên liên kết khác."
              );
            }
          });
      }),

    check("url")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập liên kết.")
      .custom((value) => {
        return Link.exists({ url: value })
          .where({ softDelete: "" })
          .then((link) => {
            if (link) {
              return Promise.reject(
                "Liên kết đã tồn tại, vui lòng nhập liên kết khác."
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
      .withMessage("Vui lòng nhập Tên liên kết.")
      .custom((value, { req }) => {
        return Link.findOne({
          _id: { $ne: req.params.id },
          name: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((link) => {
            if (link) {
              return Promise.reject(
                "Tên liên kết đã tồn tại, vui lòng nhập Tên liên kết khác."
              );
            }
          });
      }),

    check("url")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập liên kết.")
      .custom((value, { req }) => {
        return Link.findOne({
          _id: { $ne: req.params.id },
          url: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((link) => {
            if (link) {
              return Promise.reject(
                "Liên kết đã tồn tại, vui lòng nhập liên kết khác."
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
