const mongoose = require('mongoose');

const FlagSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    flagId: { type: String, required: true, index: true },
    flag: { type: String, required: true },
    capturedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate flag captures
FlagSchema.index({ userId: 1, flagId: 1 }, { unique: true });

module.exports = mongoose.model('Flag', FlagSchema);
