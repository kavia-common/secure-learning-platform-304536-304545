const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Secure Learning Platform API',
      version: '0.1.0',
      description:
        'Intentionally vulnerable, educational API for security labs. Do not deploy to the public internet.',
    },
    tags: [
      { name: 'Auth', description: 'Weak-by-design authentication endpoints' },
      { name: 'Labs', description: 'Labs catalog, hints, and solution checks' },
      { name: 'Progress', description: 'User progress tracking and leaderboard' },
      { name: 'Admin', description: 'Admin-only operations' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/**/*.js'], // Scan all route files (including subroutes)
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
