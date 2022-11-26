const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  phone: {
    type: String,
  },

  ext: {
    type: String,
  },

  sex: {
    type: Boolean,
  },

  birthday: {
    type: Date,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
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

contactSchema.index({ "$**": "text" });
const Contacts = mongoose.model("Contacts", contactSchema, "contacts");

const doc = new Contacts();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Contacts;
