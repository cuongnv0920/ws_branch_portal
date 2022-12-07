const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const md5 = require("md5");
const defaultUser = require("../config/defaultUser");

User.exists({ email: defaultUser.email }).then((user) => {
  if (!user) {
    return User.create({
      email: defaultUser.email,
      fullName: defaultUser.fullName,
      password: md5(defaultUser.password),
      role: defaultUser.role,
      createdAt: Date.now(),
    });
  }
});

module.exports.list = async (req, res, next) => {
  await User.find()
    .where({ softDelete: "" })
    .populate("room")
    .populate("level")
    .sort({ createdAt: 1 })
    .exec((error, users) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(users.map(formatUser));
    });
};

function formatUser(data) {
  const {
    _id: id,
    fullName,
    email,
    room,
    phone,
    ext,
    level,
    sex,
    role,
    birthday,
    createdAt,
  } = data;
  return {
    id,
    fullName,
    email,
    room,
    phone,
    ext,
    level,
    sex,
    role,
    birthday,
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
    await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      room: req.body.room,
      level: req.body.level,
      phone: req.body.phone,
      ext: req.body?.ext,
      sex: req.body.sex,
      role: req.body.role,
      birthday: req.body.birthday,
      createdAt: Date.now(),
    })
      .then(() => {
        return res.status(200).json({ message: "Thêm người dùng thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.update = async (req, res, next) => {
  function hashPassword() {
    if (req.body.password) {
      return md5(req.body.password);
    }
  }

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
    await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashPassword(),
        room: req.body.room,
        level: req.body.level,
        phone: req.body.phone,
        ext: req.body?.ext,
        sex: req.body.sex,
        role: req.body.role,
        birthday: req.body.birthday,
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
  await User.updateOne(
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
