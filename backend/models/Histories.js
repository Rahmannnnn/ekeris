const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  borrower: String,
  exitTime: Number,
  entryTime: Number,
  createdAt: Number,
  updatedAt: Number,
  recordId: String,
});

const HistoryModel = mongoose.model("histories", HistorySchema);
module.exports = HistoryModel;
