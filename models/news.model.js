const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: {
    type: String,
    require: [true, "Vui lòng nhập tiêu đề bài viết."],
  },

  code: {
    type: String,
  },

  type: {
    type: String,
  },

  content: {
    type: String,
  },

  command: {
    type: String,
  },

  hot: {
    type: Boolean,
  },

  view: {
    type: Number,
    default: 0,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "Categorys",
  },

  file_1: {
    type: String,
  },

  file_2: {
    type: String,
  },

  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],

  countComment: {
    type: Number,
    default: 0,
  },

  blockComment: {
    type: Boolean,
    default: false,
  },

  sort: {
    type: Number,
  },

  softDelete: {
    type: Date,
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

newsSchema.index({ "$**": "text" });
const News = mongoose.model("News", newsSchema, "news");

const doc = new News();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = News;
