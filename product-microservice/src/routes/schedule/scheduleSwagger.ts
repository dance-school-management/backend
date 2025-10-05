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
 *   post:
 *     summary: Get courses with filters
 *     tags:
 *       - schedule - courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               danceCategoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1]
 *               advancementLevelIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1]
 *               priceMin:
 *                 type: integer
 *                 example: 200
 *               priceMax:
 *                 type: integer
 *                 example: 3000
 *     responses:
 *       200:
 *         description: Successful response
 */

/**
 * @swagger
 * /schedule/courses/classes:
 *   post:
 *     summary: Get classes for given courses
 *     tags:
 *       - schedule - courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coursesIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Map of course IDs to their classes
 */
