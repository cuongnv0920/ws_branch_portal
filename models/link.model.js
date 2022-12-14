const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  name: {
    type: String,
    require: [true, "Vui lòng nhập Tên liên kết."],
  },

  url: {
    type: String,
    require: [true, "Vui lòng nhập đường dẫn tới liên kết."],
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

linkSchema.index({ "$**": "text" });
const Links = mongoose.model("Links", linkSchema, "links");

const doc = new Links();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Links;
