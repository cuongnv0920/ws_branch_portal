const { check } = require("express-validator");
const Deposit = require("../models/deposit.model");

const validatorCreate = () => {
  return [
    check("term")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Kỳ hạn.")
      .custom((value) => {
        return Deposit.exists({ term: value })
          .where({ softDelete: "" })
          .then((deposit) => {
            if (deposit) {
              return Promise.reject(
                "Kỳ hạn đã tồn tại, vui lòng nhập Kỳ hạn khác."
              );
            }
          });
      }),
  ];
};

const validatorUpdate = () => {
  return [
    check("term")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Kỳ hạn.")
      .custom((value, { req }) => {
        return Deposit.findOne({
          _id: { $ne: req.params.id },
          term: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((deposit) => {
            if (deposit) {
              return Promise.reject(
                "Kỳ hạn đã tồn tại, vui lòng nhập Kỳ hạn khác."
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
