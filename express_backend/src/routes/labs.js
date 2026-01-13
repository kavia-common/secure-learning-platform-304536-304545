const express = require('express');
const labsController = require('../controllers/labsController');
const { requireAuth, requireAdmin } = require('../middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Labs
 *     description: Labs catalog, detail, hints and solution checks
 */

/**
 * @swagger
 * /api/labs:
 *   get:
 *     tags: [Labs]
 *     summary: List published labs
 *     responses:
 *       200:
 *         description: Lab list
 */
router.get('/', labsController.listLabs);

/**
 * @swagger
 * /api/labs/{labId}:
 *   get:
 *     tags: [Labs]
 *     summary: Get lab detail
 *     parameters:
 *       - in: path
 *         name: labId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lab detail
 *       404:
 *         description: Not found
 */
router.get('/:labId', labsController.getLab);

/**
 * @swagger
 * /api/labs/{labId}/hints:
 *   get:
 *     tags: [Labs]
 *     summary: Get ordered hints for a lab
 *     parameters:
 *       - in: path
 *         name: labId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hints list
 */
router.get('/:labId/hints', labsController.getHints);

/**
 * @swagger
 * /api/labs/{labId}/submit:
 *   post:
 *     tags: [Labs]
 *     summary: Submit solution attempt (server-side check)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: labId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer: { type: string, example: "my answer" }
 *               hintsUsed: { type: number, example: 1 }
 *     responses:
 *       200:
 *         description: Check result + updated progress
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lab not found
 */
router.post('/:labId/submit', requireAuth, labsController.submitSolution);

/**
 * @swagger
 * /api/labs:
 *   post:
 *     tags: [Labs]
 *     summary: Admin create lab
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Lab created
 */
router.post('/', requireAuth, requireAdmin, labsController.createLab);

/**
 * @swagger
 * /api/labs/{labId}:
 *   put:
 *     tags: [Labs]
 *     summary: Admin update lab
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: labId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lab updated
 */
router.put('/:labId', requireAuth, requireAdmin, labsController.updateLab);

/**
 * @swagger
 * /api/labs/{labId}:
 *   delete:
 *     tags: [Labs]
 *     summary: Admin delete lab
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: labId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lab deleted
 */
router.delete('/:labId', requireAuth, requireAdmin, labsController.deleteLab);

module.exports = router;
