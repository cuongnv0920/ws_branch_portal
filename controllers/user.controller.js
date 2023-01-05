const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const defaultUser = require("../config/defaultUser");

User.exists({ email: defaultUser.email }).then((user) => {
  if (!user) {
    return User.create({
      email: defaultUser.email,
      username: defaultUser.username,
      fullName: defaultUser.fullName,
      password: md5(defaultUser.password),
      role: defaultUser.role,
      createdAt: Date.now(),
    });
  }
});

module.exports.getAll = async (req, res, next) => {
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

module.exports.getContact = async (req, res, next) => {
  const roomId = req.query.roomId;
  function room() {
    if (!!roomId) {
      return { room: roomId };
    } else {
      return {};
    }
  }

  await User.find(room())
    .where({ softDelete: "" })
    .populate("room")
    .populate("level")
    .sort({ createdAt: 1 })
    .exec((error, users) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(users.map(formatContact));
    });
};

function formatContact(data) {
  const { _id: id, fullName, email, room, phone, ext, level } = data;
  return {
    id,
    fullName,
    email,
    room,
    phone,
    ext,
    level,
  };
}

module.exports.create = async (req, res, next) => {
  const email = req.body.email;
  const username = email.substring(0, email.indexOf("@"));
  const token = jwt.sign({ user: "register" }, "shhhhh");
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
      email: email,
      username: username,
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
      .then((user) => {
        return res.status(200).json({
          jwt: token,
          user: user,
        });
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

module.exports.login = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.username;
  const password = md5(req.body.password);

  const user = await User.find({
    $or: [{ username: username }, { email: email }],
  });

  if (!user[0]) {
    return res
      .status(400)
      .json({ message: "Tên đăng nhập không tồn tại, vui lòng kiểm tra lại." });
  }

  if (user[0]?.password !== password) {
    return res
      .status(400)
      .json({ message: "Mật khẩu không đúng, vui lòng kiểm tra lại." });
  }

  const token = jwt.sign({ userId: user._id }, "shhhh");
  return res.status(200).json({
    user: user[0],
    jwt: token,
  });
};

module.exports.loginAdmin = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.username;
  const password = md5(req.body.password);

  const user = await User.find({
    $or: [{ username: username }, { email: email }],
  });

  if (!user[0]) {
    return res
      .status(400)
      .json({ message: "Tên đăng nhập không tồn tại, vui lòng kiểm tra lại." });
  }

  if (user[0]?.password !== password) {
    return res
      .status(400)
      .json({ message: "Mật khẩu không đúng, vui lòng kiểm tra lại." });
  }

  if (user[0]?.role !== "admin") {
    return res.status(400).json({ message: "Bạn không có quyền truy cập." });
  }

  const token = jwt.sign({ userId: user._id }, "shhhh");
  return res.status(200).json({
    user: user[0],
    jwt: token,
  });
};
