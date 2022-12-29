const Comment = require("../models/comment.model");

module.exports.list = async (req, res, next) => {
  await Comment.find()
    .where({ softDelete: "" })
    .populate("user")
    .sort({ createdAt: -1 })
    .exec((error, comments) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(comments.map(formatComments));
    });
};

function formatComments(data) {
  const { _id: id, user, news, content, createdAt } = data;
  return {
    id,
    user,
    news,
    content,
    createdAt,
  };
}

module.exports.get = async (req, res, next) => {
  await Comment.findById(req.params.id)
    .where({ softDelete: "" })
    .populate("user")
    .sort({ createdAt: -1 })
    .exec((error, comment) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(comment);
    });
};

module.exports.create = async (req, res, next) => {
  await Comment.create({
    user: req.body.user,
    news: req.body.news,
    content: req.body.content,
  })
    .then(() => {
      return res.status(200).json({ message: "Gửi thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

module.exports.update = async (req, res, next) => {
  await Comment.updateOne(
    {
      _id: req.params.id,
    },
    {
      content: req.body.content,
      updatedAt: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Cập nhật thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

module.exports.delete = async (req, res, next) => {
  await Comment.updateOne(
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
