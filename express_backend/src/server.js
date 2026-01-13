require('dotenv').config();

const app = require('./app');
const { connectToMongo } = require('./db/mongo');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

let server;

// Connect DB first (still starts server even if DB connection fails, but logs error)
connectToMongo()
  .then(({ uri }) => {
    console.log(`Connected to MongoDB: ${uri}`);
  })
  .catch((err) => {
    console.error('MongoDB connection failed (continuing anyway):', err);
  })
  .finally(() => {
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  });

module.exports = server;
