const mongoose = require('mongoose');

const SolutionCheckSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['exact', 'contains', 'regex'],
      default: 'exact',
    },
    value: { type: String, default: '' },
    // Optional feedback message to return on success.
    successMessage: { type: String, default: 'Correct!' },
    // Optional feedback message to return on failure.
    failureMessage: { type: String, default: 'Not quite. Try again.' },
  },
  { _id: false }
);

const LabSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },

    title: { type: String, required: true },
    description: { type: String, default: '' },

    category: { type: String, default: 'general' },
    difficulty: { type: String, default: 'easy' },

    estimatedMinutes: { type: Number, default: 10 },

    objective: { type: String, default: '' },
    remediation: { type: String, default: '' },

    // Used for server-side check on /submit. We intentionally keep it simplistic.
    solutionCheck: { type: SolutionCheckSchema, default: () => ({}) },

    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lab', LabSchema);
