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

/**
 * @swagger
 * /schedule/search/courses:
 *   get:
 *     summary: Get courses filtered by category, level, and price
 *     description: >
 *       Returns courses filtered by dance category, advancement level, and price range.
 *       All parameters are optional but at least one filter is recommended.
 *     tags:
 *       - schedule - courses
 *     parameters:
 *       - in: query
 *         name: danceCategoryIds
 *         required: true
 *         schema:
 *           type: string
 *           example: "[1, 2]"
 *         description: JSON array of dance category IDs (as stringified JSON)
 *       - in: query
 *         name: advancementLevelIds
 *         required: true
 *         schema:
 *           type: string
 *           example: "[1]"
 *         description: JSON array of advancement level IDs (as stringified JSON)
 *       - in: query
 *         name: priceMin
 *         required: true
 *         schema:
 *           type: number
 *           example: 200
 *         description: Minimum total course price
 *       - in: query
 *         name: priceMax
 *         required: true
 *         schema:
 *           type: number
 *           example: 3000
 *         description: Maximum total course price
 *     responses:
 *       200:
 *         description: List of filtered courses
 */


/**
 * @swagger
 * /schedule/courses/classes:
 *   get:
 *     summary: Get classes for given courses
 *     description: >
 *       Returns all class instances grouped by their corresponding course IDs.
 *       Accepts a list of course IDs as a JSON string in the query parameter.
 *     tags:
 *       - schedule - courses
 *     parameters:
 *       - in: query
 *         name: coursesIds
 *         required: true
 *         schema:
 *           type: string
 *           example: "[1, 2]"
 *         description: JSON array of course IDs as a stringified array (e.g. "[1,2]")
 *     responses:
 *       200:
 *         description: Successful response containing courses and their related classes
 */

