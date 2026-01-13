const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true, index: true },

    // Intentionally stores raw answer (do NOT do this in real systems).
    answer: { type: String, default: '' },

    correct: { type: Boolean, default: false },
    feedback: { type: String, default: '' },

    hintsUsed: { type: Number, default: 0 },

    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', SubmissionSchema);
