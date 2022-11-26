const Category = require("../models/category.model");
const { validationResult } = require("express-validator");

module.exports.list = async (req, res, next) => {
  await Category.find()
    .where({ softDelete: "" })
    .sort({ createdAt: -1 })
    .exec((error, categorys) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(categorys.map(formatCategory));
    });
};

function formatCategory(categoryFormDB) {
  const { _id: id, name, createdAt } = categoryFormDB;
  return {
    id,
    name,
    createdAt,
  };
}

module.exports.create = async (req, res, next) => {
  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  } else {
    await Category.create({
      name: req.body.name,
    })
      .then(() => {
        return res.status(200).json({ message: "Thêm danh mục thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};
