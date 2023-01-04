const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const depositSchema = new Schema({
  term: {
    type: String,
  },

  vnd: {
    type: Number,
  },

  usd: {
    type: Number,
  },

  online: {
    type: Number,
  },

  notification: {
    type: Date,
    default: new Date(),
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

depositSchema.index({ "$**": "text" });
const Deposit = mongoose.model("Deposit", depositSchema, "deposit");

const doc = new Deposit();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Deposit;
