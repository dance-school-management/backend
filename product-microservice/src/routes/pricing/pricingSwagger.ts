/**
 * @swagger
 * /public/pricing/most_popular_courses:
 *   get:
 *     summary: Get most popular courses
 *     description: >
 *       Returns top (10) most popular (but having at least one ticket bought) courses 
 *       within the specified date range for the pricing page.
 *     tags:
 *       - pricing - public
 *     parameters:
 *       - in: query
 *         name: startDateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00Z"
 *         required: true
 *         description: Start date of the range (inclusive)
 *       - in: query
 *         name: startDateTo
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-12-31T23:59:59Z"
 *         required: true
 *         description: End date of the range (inclusive)
 *       - in: query
 *         name: topK
 *         schema:
 *           type: integer
 *           example: 10
 *         required: true
 *         description: (k) in "top k most popular courses" 
 *     responses:
 *       200:
 *         description: Successful response containing a list of the most popular courses.
 *       400:
 *         description: Missing or invalid date parameters.
 *       500:
 *         description: Internal server error.
 */
