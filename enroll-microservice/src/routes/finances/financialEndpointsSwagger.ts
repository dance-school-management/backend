/**
 * @swagger
 * /admin/metrics/revenue:
 *   get:
 *     summary: Retrieves revenue statistics grouped by periods
 *     tags: 
 *       - metrics
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-05-05T12:00:00
 *         description: Start date (ISO 8601, e.g. 2023-10-01T00:00:00Z)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-06-24T12:00:00
 *         description: End date
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter]
 *         description: Time unit used to group the results
 *         example: month
 *     responses:
 *       200:
 *         description: Data successfully retrieved
 */

/**
 * @swagger
 * /admin/metrics/courses/top:
 *   get:
 *     summary: Get top courses metrics in a given date range
 *     description: Returns revenue summary for each course in the selected period. If no dates are provided, uses the current month.
 *     tags:
 *       - metrics
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-05-11T12:00:00
 *         required: false
 *         description: Start date of the period (ISO string)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-09-11T12:00:00
 *         required: false
 *         description: End date of the period (ISO string)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit number of returned items (not currently used in implementation)
 *
 *     responses:
 *       200:
 *         description: Metrics summary of sold courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-01T00:00:00.000Z"
 *                     end:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-28T23:59:59.999Z"
 *                 totalCourses:
 *                   type: integer
 *                   example: 5
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "JavaScript Bootcamp"
 *                       revenue:
 *                         type: number
 *                         example: 1499.00
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
