const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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

commentSchema.index({ "$**": "text" });
const Comments = mongoose.model("Comments", commentSchema, "comments");

const doc = new Comments();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Comments;
