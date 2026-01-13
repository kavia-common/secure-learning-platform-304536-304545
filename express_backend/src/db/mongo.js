const mongoose = require('mongoose');

/**
 * Resolve Mongo connection string from environment, falling back to local dev default.
 * Intentionally simple for the learning platform.
 */
function resolveMongoUri() {
  return (
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    'mongodb://127.0.0.1:27017/secure_learning_platform'
  );
}

// PUBLIC_INTERFACE
async function connectToMongo() {
  /**
   * Connect to MongoDB via Mongoose.
   * @returns {Promise<{uri: string}>} The URI used (useful for logs).
   */
  const uri = resolveMongoUri();

  // Intentionally minimal configuration (this project is a learning sandbox).
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  return { uri };
}

module.exports = {
  connectToMongo,
  resolveMongoUri,
};
