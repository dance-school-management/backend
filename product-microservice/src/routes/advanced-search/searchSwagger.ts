/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search documents (semantic or full list)
 *     description: >
 *       Performs a semantic KNN search on either **class_templates** or **courses** index using vector embeddings,  
 *       or returns a simple paginated list of all documents when **searchQuery** is not provided.  
 *       Supports filtering by dance categories, advancement levels, and price range.
 *     tags:
 *       - search
 *     parameters:
 *       - in: query
 *         name: index
 *         schema:
 *           type: string
 *           enum: [class_templates, courses]
 *         required: true
 *         description: Target Elasticsearch index.
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Natural language query to embed and use for semantic KNN vector search.  
 *           If omitted, uses a value of "dance class or course".
 *       - in: query
 *         name: danceCategoriesIds
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Optional filter by one or more dance category IDs.
 *         example: [1, 2, 5]
 *       - in: query
 *         name: advancementLevelsIds
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Optional filter by advancement level IDs.
 *         example: [1, 3]
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *           default: 0
 *         description: Minimum course/class price filter.
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *           default: 9999999
 *         description: Maximum course/class price filter.
 *       - in: query
 *         name: topK
 *         schema:
 *           type: integer
 *           default: 10
 *         required: true
 *         description: Number of nearest neighbors (K) to return for semantic search.
 *       - in: query
 *         name: numCandidates
 *         schema:
 *           type: integer
 *           default: 100
 *         required: true
 *         description: Number of candidates for approximate KNN search.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: >
 *           List of documents with (optional) similarity scores.  
 *           The field `descriptionEmbedded` is excluded from results.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   document:
 *                     type: object
 *                     description: The indexed document without `descriptionEmbedded`.
 *                   score:
 *                     type: number
 *                     nullable: true
 *                     description: Similarity score from Elasticsearch (present only for semantic search).
 *       400:
 *         description: Invalid or missing parameters.
 *       500:
 *         description: Internal server error or Elasticsearch failure.
 */
