const { check } = require("express-validator");
const Margin = require("../models/margin.model");

const validatorCreate = () => {
  return [
    check("currency")
      .not()
      .isEmpty()
      .withMessage("Vui lòng chọn mã ngoại tệ.")
      .custom((value) => {
        return Margin.exists({ currency: value })
          .where({ softDelete: "" })
          .then((margin) => {
            if (margin) {
              return Promise.reject(
                "Mã ngoại tệ đã tồn tại, vui lòng kiểm tra lại."
              );
            }
          });
      }),

    check("buyCash")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập biên độ mua tiền mặt."),

    check("buyTransfer")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập biên độ mua chuyển khoản."),

    check("selling")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập biên độ giá bán."),
  ];
};

const validatorUpdate = () => {
  return [
    check("currency")
      .not()
      .isEmpty()
      .withMessage("Vui lòng chọn mã ngoại tệ.")
      .custom((value, { req }) => {
        return Margin.findOne({
          _id: { $ne: req.params.id },
          currency: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((margin) => {
            if (margin) {
              return Promise.reject(
                "Mã ngoại tệ đã tồn tại, vui lòng kiểm tra lại."
              );
            }
          });
      }),

    check("buyCash")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập biên độ mua tiền mặt."),

    check("buyTransfer")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập biên độ mua chuyển khoản."),

    check("selling")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập biên độ giá bán."),
  ];
};

const validator = {
  validatorCreate,
  validatorUpdate,
};

module.exports = validator;
