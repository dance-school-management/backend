/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         authorId:
 *           type: integer
 *           example: 1
 *         courseTemplateId:
 *           type: integer
 *           example: 1
 *         text:
 *           type: string
 *           example: "This is a review text"
 *         stars:
 *           type: float
 *           example: 4.5
 *         author:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: "john_doe"
 *             photoUrl:
 *               type: string
 *               example: "https://example.com/photo.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T12:00:00Z"
 */

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get all reviews with optional filtering
 *     tags:
 *       - Review
 *     parameters:
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: integer
 *         description: Filter reviews by author ID
 *       - in: query
 *         name: courseTemplateId
 *         schema:
 *           type: integer
 *         description: Filter reviews by course template ID
 *       - in: query
 *         name: stars
 *         schema:
 *           type: number
 *           format: float
 *         description: Filter reviews by minimum star rating
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter reviews by author's username
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter reviews by creation date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of reviews to retrieve per page
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
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
 *         description: Bad request, invalid parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /review/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags:
 *       - Review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review to retrieve
 *     responses:
 *       200:
 *         description: The requested review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /review:
 *   post:
 *     summary: Create a new review
 *     tags:
 *       - Review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: integer
 *               courseTemplateId:
 *                 type: integer
 *               text:
 *                 type: string
 *               stars:
 *                 type: number
 *                 format: float
 *               author:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   photoUrl:
 *                     type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request, invalid parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /review/{id}:
 *   put:
 *     summary: Update a review
 *     tags:
 *       - Review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               stars:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request, invalid parameters
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags:
 *       - Review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */