const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    // Intentionally weak by design for this learning platform (do NOT do this in production).
    password: { type: String, required: true },

    displayName: { type: String, default: '' },

    // Basic role flag (intentionally easy to abuse in this intentionally vulnerable app).
    roles: {
      type: [String],
      default: ['user'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'roles must be a non-empty array',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
