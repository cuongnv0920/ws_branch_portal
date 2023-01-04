const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exchangeRateSchema = new Schema({
  ensign: {
    type: String,
  },

  currency: {
    type: String,
  },

  buyCash: {
    type: Number,
  },

  buyTransfer: {
    type: Number,
  },

  selling: {
    type: Number,
  },

  notificationNumber: {
    type: String,
    default: "0",
  },

  notificationDate: {
    type: String,
    default: "",
  },

  notificationHourd: {
    type: String,
    default: "",
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

exchangeRateSchema.index({ "$**": "text" });
const ExchangeRate = mongoose.model(
  "ExchangeRate",
  exchangeRateSchema,
  "exchangeRate"
);

const doc = new ExchangeRate();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = ExchangeRate;
