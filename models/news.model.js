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

  status: {
    type: Boolean,
    default: true,
  },

  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Categorys",
  },

  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comments",
  },

  uploadId: {
    type: Schema.Types.ObjectId,
    ref: "Uploads",
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
