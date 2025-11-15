/**
 * @swagger
 * /search:
 *   get:
 *     summary: Semantic + filtered search on class_templates or courses index
 *     description: >
 *       Performs a semantic KNN search using vector embeddings on the selected Elasticsearch index.  
 *       Supports filtering by dates, price range, dance categories, and advancement levels.  
 *       Pagination and candidate limits can be configured.  
 *       If `searchQuery` is missing, a default semantic query `"dance class or course"` is used.
 *     tags:
 *       - search
 *     parameters:
 *       - in: query
 *         name: index
 *         schema:
 *           type: string
 *           enum: [class_templates, courses]
 *         required: true
 *         description: Target Elasticsearch index to search in.
 *
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Natural language query to embed and use for semantic KNN vector search.  
 *           If omitted, defaults to `"dance class or course"`.
 *
 *       - in: query
 *         name: danceCategoriesIds
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         required: false
 *         description: Filter results by dance category IDs.
 *         example: [1, 2, 5]
 *
 *       - in: query
 *         name: advancementLevelsIds
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         required: false
 *         description: Filter results by advancement level IDs.
 *         example: [1, 3]
 *
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *           default: 0
 *         required: false
 *         description: Minimum course/class price.
 *
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *           default: 9999999
 *         required: false
 *         description: Maximum course/class price.
 *
 *       - in: query
 *         name: startDateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filter for classes/courses starting on or after this date.
 *
 *       - in: query
 *         name: startDateTo
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filter for classes/courses starting on or before this date.
 *
 *       - in: query
 *         name: endDateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filter for classes/courses ending on or after this date.
 *
 *       - in: query
 *         name: endDateTo
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filter for classes/courses ending on or before this date.
 *
 *       - in: query
 *         name: topK
 *         schema:
 *           type: integer
 *           default: 10
 *         required: true
 *         description: Number of nearest neighbors (K) to retrieve from KNN search.
 *
 *       - in: query
 *         name: numCandidates
 *         schema:
 *           type: integer
 *           default: 100
 *         required: true
 *         description: Number of approximate candidates to consider during KNN search.
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination.
 *
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of items per page.
 *
 *     responses:
 *       200:
 *         description: >
 *           A list of search results with optional semantic similarity scores.  
 *           Field `descriptionEmbedded` is removed from the returned document.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   document:
 *                     type: object
 *                     description: Returned Elasticsearch document (without `descriptionEmbedded`).
 *                   score:
 *                     type: number
 *                     nullable: true
 *                     description: Semantic similarity score. Might be null depending on search mode.
 *
 *       400:
 *         description: Invalid or missing parameters.
 *
 *       500:
 *         description: Internal server error or Elasticsearch failure.
 */
