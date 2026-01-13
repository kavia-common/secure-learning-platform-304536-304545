const express = require('express');
const progressController = require('../controllers/progressController');
const { requireAuth } = require('../middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Progress
 *     description: Progress tracking endpoints
 */

/**
 * @swagger
 * /api/progress/me:
 *   get:
 *     tags: [Progress]
 *     summary: Get current user's progress entries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress list
 */
router.get('/me', requireAuth, progressController.myProgress);

/**
 * @swagger
 * /api/progress/summary:
 *   get:
 *     tags: [Progress]
 *     summary: Get current user's progress summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary
 */
router.get('/summary', requireAuth, progressController.mySummary);

/**
 * @swagger
 * /api/progress/leaderboard:
 *   get:
 *     tags: [Progress]
 *     summary: Leaderboard (by completed labs)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 10 }
 *     responses:
 *       200:
 *         description: Leaderboard list
 */
router.get('/leaderboard', progressController.leaderboard);

/**
 * @swagger
 * /api/progress/reset:
 *   post:
 *     tags: [Progress]
 *     summary: Reset current user's progress
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reset complete
 */
router.post('/reset', requireAuth, progressController.resetMyProgress);

/**
 * @swagger
 * /api/progress/flags:
 *   get:
 *     tags: [Progress]
 *     summary: Get current user's captured CTF flags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Captured flags list
 */
router.get('/flags', requireAuth, progressController.getCapturedFlags);

module.exports = router;
