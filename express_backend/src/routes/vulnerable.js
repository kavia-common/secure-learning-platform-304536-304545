const express = require('express');
const vulnerableController = require('../controllers/vulnerableController');
const { requireAuth, optionalAuth } = require('../middleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads (intentionally insecure)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Intentionally preserve original filename (vulnerable)
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   - name: Vulnerable
 *     description: Intentionally vulnerable endpoints for educational labs
 */

/**
 * @swagger
 * /api/vulnerable/comments:
 *   get:
 *     tags: [Vulnerable]
 *     summary: Get all comments (Stored XSS vulnerable)
 *     responses:
 *       200:
 *         description: Comments list
 */
router.get('/comments', vulnerableController.getComments);

/**
 * @swagger
 * /api/vulnerable/comments:
 *   post:
 *     tags: [Vulnerable]
 *     summary: Post a comment (Stored XSS vulnerable - no sanitization)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post('/comments', vulnerableController.postComment);

/**
 * @swagger
 * /api/vulnerable/search:
 *   get:
 *     tags: [Vulnerable]
 *     summary: Search items (Reflected XSS vulnerable)
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', vulnerableController.search);

/**
 * @swagger
 * /api/vulnerable/login-nosql:
 *   post:
 *     tags: [Vulnerable]
 *     summary: Login endpoint (NoSQL Injection vulnerable)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login-nosql', vulnerableController.loginNoSQL);

/**
 * @swagger
 * /api/vulnerable/user/{userId}:
 *   get:
 *     tags: [Vulnerable]
 *     summary: Get user profile (IDOR vulnerable - no access control)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/user/:userId', requireAuth, vulnerableController.getUserProfile);

/**
 * @swagger
 * /api/vulnerable/change-email:
 *   post:
 *     tags: [Vulnerable]
 *     summary: Change email (CSRF vulnerable - no token check)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail: { type: string }
 *     responses:
 *       200:
 *         description: Email changed
 */
router.post('/change-email', requireAuth, vulnerableController.changeEmail);

/**
 * @swagger
 * /api/vulnerable/upload:
 *   post:
 *     tags: [Vulnerable]
 *     summary: Upload file (File Upload vulnerable - no validation)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: File uploaded
 */
router.post('/upload', requireAuth, upload.single('file'), vulnerableController.uploadFile);

/**
 * @swagger
 * /api/vulnerable/ping:
 *   post:
 *     tags: [Vulnerable]
 *     summary: Ping command (Command Injection vulnerable)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               host: { type: string }
 *     responses:
 *       200:
 *         description: Ping result
 */
router.post('/ping', requireAuth, vulnerableController.ping);

/**
 * @swagger
 * /api/vulnerable/flags/{flagId}:
 *   post:
 *     tags: [Vulnerable]
 *     summary: Submit a CTF flag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: flagId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flag: { type: string }
 *     responses:
 *       200:
 *         description: Flag validation result
 */
router.post('/flags/:flagId', requireAuth, vulnerableController.submitFlag);

module.exports = router;
