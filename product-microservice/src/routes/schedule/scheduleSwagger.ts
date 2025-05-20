/**
 * @swagger
 * /schedule:
 *   get:
 *     summary: Get schedule for a given date range
 *     tags:
 *       - student
 *         - schedule
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
 *       - in: query
 *         name: mySchedule
 *         required: true
 *         schema:
 *           type: boolean
 *         description: Show my schedule or all classes
 *         example: false
 *     responses:
 *       200:
 *         description: Successful response
 */
