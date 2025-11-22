/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for class templates or courses
 *     description: >
 *       Returns a filtered and paginated list of class templates or courses based on various query parameters.
 *       Hidden items (`courseStatus = HIDDEN`) are automatically excluded.
 *
 *     tags:
 *       - search - postgres
 *
 *     parameters:
 *       - in: query
 *         name: index
 *         required: true
 *         description: Select which resource to search.
 *         schema:
 *           type: string
 *           enum: [class_templates, courses]
 *
 *       - in: query
 *         name: searchQuery
 *         required: false
 *         description: Text search in name and description.
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: danceCategoriesIds
 *         required: false
 *         description: >
 *           Filter by dance category IDs. Can be a single value or an array.
 *           Example: `?danceCategoriesIds=1&danceCategoriesIds=3`
 *         schema:
 *           type: array
 *           items:
 *             type: number
 *           example: [1, 2, 5]
 *       - in: query
 *         name: advancementLevelsIds
 *         required: false
 *         description: >
 *           Filter by advancement level IDs. Can be single or array.
 *         schema:
 *           type: array
 *           items:
 *             type: number
 *           example: [1, 2, 3]
 *       - in: query
 *         name: priceMin
 *         required: false
 *         description: Minimum price filter.
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: priceMax
 *         required: false
 *         description: Maximum price filter.
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: startDateFrom
 *         required: false
 *         description: ISO date, filters classes with startDate >= this value.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: startDateTo
 *         required: false
 *         description: ISO date, filters classes with startDate <= this value.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: endDateFrom
 *         required: false
 *         description: ISO date, filters classes with endDate >= this value.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: endDateTo
 *         required: false
 *         description: ISO date, filters classes with endDate <= this value.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: page
 *         required: true
 *         description: Page number (1-based).
 *         schema:
 *           type: number
 *           example: 1
 *
 *       - in: query
 *         name: itemsPerPage
 *         required: true
 *         description: Number of items per page.
 *         schema:
 *           type: number
 *           example: 10
 *
 *     responses:
 *       200:
 *         description: Successful response with search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Course or ClassTemplate object depending on selected index.
 *
 *       500:
 *         description: Internal server error.
 */
