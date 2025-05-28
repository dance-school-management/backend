/**
 * @swagger
 * /schedule:
 *   get:
 *     summary: Get schedule for a given date range
 *     tags:
 *       - schedule
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-05-01T00:00:00.000Z"
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-05-31T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Successful response
 */

/**
 * @swagger
 * /schedule/personal:
 *   get:
 *     summary: Get schedule for a given date range
 *     tags:
 *       - schedule
 *        - personal
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-05-01T00:00:00.000Z"
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-05-31T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Successful response
 */
