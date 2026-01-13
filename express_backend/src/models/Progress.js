const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true, index: true },

    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
      index: true,
    },

    attemptsCount: { type: Number, default: 0 },
    correctAttemptsCount: { type: Number, default: 0 },

    hintCount: { type: Number, default: 0 },

    lastAttemptAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Avoid duplicates per user/lab.
ProgressSchema.index({ userId: 1, labId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
