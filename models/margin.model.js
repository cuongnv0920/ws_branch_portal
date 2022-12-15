const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marginSchema = new Schema({
  ensign: {
    type: String,
  },

  currency: {
    type: String,
  },

  buyCash: {
    type: Number,
    default: 0,
  },

  buyTransfer: {
    type: Number,
    default: 0,
  },

  selling: {
    type: Number,
    default: 0,
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

marginSchema.index({ "$**": "text" });
const Margin = mongoose.model("Margin", marginSchema, "margin");

const doc = new Margin();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Margin;
