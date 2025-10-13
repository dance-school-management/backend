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
 *         example: "2025-11-01T00:00:00.000Z"
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-11-08T23:59:59.000Z"
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
 *         example: "2026-05-08T23:59:59.000Z"
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
 *           type: array
 *           items:
 *              type: integer
 *           example: [1,2]
 *       - in: query
 *         name: advancementLevelIds
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *              type: integer
 *           example: [1,2]
 *       - in: query
 *         name: priceMin
 *         required: false
 *         schema:
 *           type: number
 *           example: 200
 *       - in: query
 *         name: priceMax
 *         required: false
 *         schema:
 *           type: number
 *           example: 3000
 *       - in: query
 *         name: instructorsIds
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["11", "12"]
 *         
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
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2]
 *     responses:
 *       200:
 *         description: Successful response containing courses and their related classes
 */

