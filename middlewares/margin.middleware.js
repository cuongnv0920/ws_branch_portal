const ExchangeRate = require("../models/exchangeRate.model");

module.exports.create = async (req, res, next) => {
  const ensign = (name) => {
    return `images/${name.slice(0, 3)}.png`;
  };

  await ExchangeRate.create({
    ensign: ensign(req.body.currency),
    currency: req.body.currency,
    buyCash: 0,
    buyTransfer: 0,
    selling: 0,
    sort: req.body.sort,
    createdAt: Date.now(),
  })
    .then(() => {
      console.log("Thêm mã ngoại tệ " + req.body.currency + " thành công.");
    })
    .catch((error) => {
      console.log({ message: error });
    });
};

module.exports.update = async (req, res, next) => {
  await ExchangeRate.updateOne(
    { currency: req.body.currency },
    {
      sort: req.body.sort,
      updatedAt: Date.now(),
    }
  )
    .then(() => {
      console.log("Câp nhật mã ngoại tệ " + req.body.currency + " thành công.");
    })
    .catch((error) => {
      console.log({ message: error });
    });
};
