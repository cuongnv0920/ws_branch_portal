const Deposit = require("../models/deposit.model");
const { validationResult, body } = require("express-validator");

module.exports.getAll = async (req, res, next) => {
  await Deposit.find()
    .where({ softDelete: "" })
    .sort({ sort: 1 })
    .exec((error, deposits) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(deposits.map(formatDeposit));
    });
};

function formatDeposit(data) {
  const { _id: id, term, vnd, usd, online, effect, sort, createdAt } = data;
  return {
    id,
    term,
    vnd,
    usd,
    online,
    effect,
    sort,
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
    await Deposit.create({
      term: req.body.term,
      vnd: req.body.vnd,
      usd: req.body.usd,
      online: req.body.online,
      sort: req.body.sort,
      createdAt: Date.now(),
    })
      .then(() => {
        return res
          .status(200)
          .json({ message: "Thêm biên Kỳ hạn lãi suất tiền gửi thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.update = async (req, res, next) => {
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
    await Deposit.updateOne(
      {
        _id: req.params.id,
      },
      {
        term: req.body.term,
        vnd: req.body.vnd,
        usd: req.body.usd,
        sort: req.body.sort,
        online: req.body.online,
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
  await Deposit.updateOne(
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

module.exports.effect = async (req, res, next) => {
  await Deposit.updateMany({}, { effect: new Date(req.body.effect) })
    .then(() => {
      return res.status(200).json({ message: "Cập nhật thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};
