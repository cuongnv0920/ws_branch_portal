const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    require: [true, "Vui lòng nhập tên Danh mục."],
  },

  role: {
    type: String,
    default: "user",
  },

  softDelete: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  updatedAt: {
    type: Date,
  },
});

categorySchema.index({ "$**": "text" });
const Categorys = mongoose.model("Categorys", categorySchema, "categorys");

const doc = new Categorys();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Categorys;
