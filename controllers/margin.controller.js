const Margin = require("../models/margin.model");
const ExchangeRate = require("../models/exchangeRate.model");
const { validationResult } = require("express-validator");

module.exports.list = async (req, res, next) => {
  await Margin.find()
    .where({ softDelete: "" })
    .sort({ createdAt: 1 })
    .exec((error, margins) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(margins.map(formatMargin));
    });
};

function formatMargin(data) {
  const {
    _id: id,
    ensign,
    currency,
    buyCash,
    buyTransfer,
    selling,
    createdAt,
  } = data;
  return {
    id,
    ensign,
    currency,
    buyCash,
    buyTransfer,
    selling,
    createdAt,
  };
}

module.exports.create = async (req, res, next) => {
  const ensign = (name) => {
    return `images/${name.slice(0, 3)}.png`;
  };

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
    await Margin.create({
      ensign: ensign(req.body.currency),
      currency: req.body.currency,
      buyCash: req.body.buyCash,
      buyTransfer: req.body.buyTransfer,
      selling: req.body.selling,
    })
      .then(() => {
        return res
          .status(200)
          .json({ message: "Thêm biên độ ngoại tệ thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });

    await ExchangeRate.create({
      ensign: ensign(req.body.currency),
      currency: req.body.currency,
      buyCash: 0,
      buyTransfer: 0,
      selling: 0,
    })
      .then(() => {
        console.log("Thêm mã ngoại tệ " + req.body.currency + " thành công.");
      })
      .catch((error) => {
        console.log({ message: error });
      });
  }
};

module.exports.update = async (req, res, next) => {
  const ensign = (name) => {
    return `images/${name.slice(0, 3)}.png`;
  };

  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors });
  } else {
    await Margin.updateOne(
      {
        _id: req.params.id,
      },
      {
        ensign: ensign(req.body.currency),
        currency: req.body.currency,
        buyCash: req.body.buyCash,
        buyTransfer: req.body.buyTransfer,
        selling: req.body.selling,
        updatedAt: Date.now(),
      }
    )
      .then(() => {
        return res.status(200).json({ message: "Cập nhật thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.delete = async (req, res, next) => {
  await Margin.updateOne(
    {
      _id: req.params.id,
    },
    {
      softDelete: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Xóa thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};
