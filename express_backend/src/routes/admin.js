const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin-only operations
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List users (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */
router.get('/users', requireAuth, requireAdmin, adminController.listUsers);

/**
 * @swagger
 * /api/admin/users/{userId}/roles:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a user's roles (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roles:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["admin"]
 *     responses:
 *       200:
 *         description: Updated user
 */
router.patch('/users/:userId/roles', requireAuth, requireAdmin, adminController.setUserRoles);

/**
 * @swagger
 * /api/admin/users/{userId}/reset:
 *   post:
 *     tags: [Admin]
 *     summary: Reset a user's progress/submissions (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reset complete
 */
router.post('/users/:userId/reset', requireAuth, requireAdmin, adminController.resetUser);

module.exports = router;
