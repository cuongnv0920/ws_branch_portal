const News = require("../models/news.model");
const { validationResult, body } = require("express-validator");

module.exports.list = async (req, res, next) => {
  await News.find()
    .where({ softDelete: "" })
    .populate("category")
    .populate("user")
    .populate("comment")
    .populate({
      path: "comment",
      populate: { path: "user" },
    })
    .populate()
    .sort({ createdAt: -1 })
    .exec((error, news) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(news.map(formatNews));
    });
};

function formatNews(data) {
  const {
    _id: id,
    title,
    category,
    code,
    content,
    command,
    comment,
    countComment,
    blockComment,
    file_1,
    file_2,
    hot,
    type,
    view,
    createdAt,
  } = data;

  return {
    id,
    title,
    category,
    code,
    content,
    command,
    comment,
    countComment,
    blockComment,
    file_1,
    file_2,
    hot,
    type,
    view,
    createdAt,
  };
}

module.exports.get = async (req, res, next) => {
  await News.findById(req.params.id)
    .populate("category")
    .populate("user")
    .populate("comment")
    .populate({
      path: "comment",
      populate: { path: "user" },
    })
    .populate()
    .exec((error, news) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(news);
    });
};

module.exports.detail = async (req, res, next) => {
  await News.findById(req.params.id)
    .where({ softDelete: "" })
    .populate("category")
    .populate("user")
    .populate("comment")
    .populate({
      path: "comment",
      populate: { path: "user" },
    })
    .populate()
    .sort({ createdAt: -1 })
    .exec((error, news) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(news);
    });
};

module.exports.create = async (req, res, next) => {
  function file_1() {
    if (req.files.file_1) {
      const file_1 = req.files?.file_1[0];
      return {
        path: file_1.path.split("\\").slice(1).join("/"),
        size: file_1.size,
        originalname: file_1.originalname,
        mimetype: file_1.mimetype,
      };
    } else {
      return;
    }
  }

  function file_2() {
    if (req.files.file_2) {
      const file_2 = req.files?.file_2[0] || {};
      return {
        path: file_2.path.split("\\").slice(1).join("/"),
        size: file_2.size,
        originalname: file_2.originalname,
        mimetype: file_2.mimetype,
      };
    } else {
      return "";
    }
  }

  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (file_1()?.size > 8 * 1024 * 1024 || file_2()?.size > 8 * 1024 * 1024) {
    return req
      .status(400)
      .json({ message: "File đính kèm không được vượt quá 8MB." });
  }

  await News.create({
    title: req.body.title,
    category: req.body.category,
    type: req.body.type,
    code: req.body.code,
    content: req.body.content,
    command: req.body.command,
    bockComment: req.body.bockComment,
    user: req.body.user,
    file_1: file_1()?.path,
    file_2: file_2()?.path,
    hot: req.body.hot,
  })
    .then(() => {
      return res.status(200).json({ message: "Thêm bài viết thành công." });
    })
    .catch((error) => {
      return console.log(error);
    });
};

module.exports.update = async (req, res, next) => {
  function file_1() {
    if (req.files.file_1) {
      const file_1 = req.files?.file_1[0];
      return {
        path: file_1.path.split("\\").slice(1).join("/"),
        size: file_1.size,
        originalname: file_1.originalname,
        mimetype: file_1.mimetype,
      };
    }
  }

  function file_2() {
    if (req.files.file_2) {
      const file_2 = req.files?.file_2[0] || {};
      return {
        path: file_2.path.split("\\").slice(1).join("/"),
        size: file_2.size,
        originalname: file_2.originalname,
        mimetype: file_2.mimetype,
      };
    }
  }

  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (file_1()?.size > 8 * 1024 * 1024 || file_2()?.size > 8 * 1024 * 1024) {
    return req
      .status(400)
      .json({ message: "File đính kèm không được vượt quá 8MB." });
  }

  await News.updateOne(
    {
      _id: req.params.id,
    },
    {
      title: req.body.title,
      category: req.body.category,
      type: req.body.type,
      code: req.body.code,
      content: req.body.content,
      command: req.body.command,
      bockComment: req.body.bockComment,
      file_1: file_1()?.path,
      file_2: file_2()?.path,
      hot: req.body.hot,
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Sửa bài viết thành công." });
    })
    .catch((error) => {
      return console.log(error);
    });
};

module.exports.delete = async (req, res, next) => {
  await News.updateOne(
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
