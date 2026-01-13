const mongoose = require('mongoose');

const HintSchema = new mongoose.Schema(
  {
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true, index: true },
    order: { type: Number, default: 1 },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hint', HintSchema);
