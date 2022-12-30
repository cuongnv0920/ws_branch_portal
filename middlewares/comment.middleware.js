const News = require("../models/news.model");

module.exports.create = async (req, res, next) => {
  const news = await News.findById(req.body.news);
  const countComment = news.countComment;

  await News.updateOne(
    {
      _id: req.body.news,
    },
    {
      countComment: countComment + 1,
    }
  )
    .then(() => {
      return console.log(countComment);
    })
    .catch((error) => {
      return console.log(error);
    });
};

module.exports.delete = async (req, res, next) => {
  const news = await News.findById(req.body.news);
  const countComment = news.countComment;

  await News.updateOne(
    {
      _id: req.body.news,
    },
    {
      countComment: countComment - 1,
    }
  )
    .then(() => {
      return console.log(countComment);
    })
    .catch((error) => {
      return console.log(error);
    });
};
