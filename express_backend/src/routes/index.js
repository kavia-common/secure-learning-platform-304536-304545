const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const labsRoutes = require('./labs');
const progressRoutes = require('./progress');
const adminRoutes = require('./admin');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health endpoint
 *     description: Canonical health endpoint (alias of `/`).
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/health', healthController.check.bind(healthController));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root health endpoint (alias)
 *     description: Backwards-compatible alias of `/health`.
 *     responses:
 *       200:
 *         description: Service health check passed
 */
router.get('/', healthController.check.bind(healthController));

// API routes
router.use('/api/auth', authRoutes);
router.use('/api/labs', labsRoutes);
router.use('/api/progress', progressRoutes);
router.use('/api/admin', adminRoutes);

module.exports = router;
