const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // VULNERABLE: Stores raw HTML/JavaScript without sanitization
    comment: { type: String, required: true },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
