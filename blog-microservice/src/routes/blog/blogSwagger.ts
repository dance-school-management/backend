/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "My first blog post"
 *         data:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *               example: "This is the content of my first blog post."
 *             photos:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - "https://example.com/photo1.jpg"
 *                 - "https://example.com/photo2.jpg"
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - "tag1"
 *                 - "tag2"
 *             authors:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - "author1"
 *                 - "author2"
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get all blog entries with optional filtering
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *         description: Filter by creation date (YYYY-MM-DDTHH:MM:SSZ)
 *       - in: query
 *         name: authors
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by authors
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by tags
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of results
 *     responses:
 *       200:
 *         description: A list of blog entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a new blog entry
 *     tags:
 *       - Blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - data
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My first blog post"
 *               data:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                     example: "This is the content of my first blog post."
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "https://example.com/photo1.jpg"
 *                       - "https://example.com/photo2.jpg"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "tag1"
 *                       - "tag2"
 *                   authors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "author1"
 *                       - "author2"
 *     responses:
 *       201:
 *         description: Blog entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get a blog entry by ID
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog entry to retrieve
 *     responses:
 *       200:
 *         description: Blog entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog entry not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   put:
 *     summary: Update a blog entry
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated blog post title"
 *               data:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                     example: "Updated content of my blog post."
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "https://example.com/photo1.jpg"
 *                       - "https://example.com/photo2.jpg"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "tag1"
 *                       - "tag2"
 *                   authors:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "author1"
 *                       - "author2"
 *     responses:
 *       200:
 *         description: Blog entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Blog entry not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   delete:
 *     summary: Delete a blog entry by ID
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog entry to delete
 *     responses:
 *       200:
 *         description: Blog entry deleted successfully
 *       404:
 *         description: Blog entry not found
 *       500:
 *         description: Internal server error
 */