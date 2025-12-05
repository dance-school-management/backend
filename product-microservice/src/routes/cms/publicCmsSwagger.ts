/**
 * @swagger
 * /public/cms/advancement_level:
 *   get:
 *     summary: Get all advancement levels
 *     tags:
 *       - cms - public
 *     responses:
 *       200:
 *         description: List of advancement levels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/AdvancementLevel"
 *       404:
 *         description: No advancement levels found
 */

/**
 * @swagger
 * /public/cms/advancement_level/{id}:
 *   get:
 *     summary: Get advancement level by ID
 *     tags:
 *       - cms - public
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advancement level ID
 *     responses:
 *       200:
 *         description: Advancement level found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AdvancementLevel"
 *       404:
 *         description: Advancement level not found
 */

/**
 * @swagger
 * /public/cms/class_room/{id}:
 *   get:
 *     summary: Get a classroom by ID
 *     description: Retrieves a single classroom using its unique ID.
 *     tags:
 *       - cms - public
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the classroom to retrieve
 *         example: 1
 *     responses:
 *       "200":
 *         description: Classroom retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClassRoom"
 *       "400":
 *         description: Bad Request (invalid or missing ID)
 *       "404":
 *         description: Classroom not found
 *       "500":
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /public/cms/class_room:
 *   get:
 *     summary: Get all classrooms
 *     description: Retrieves a list of all available classrooms.
 *     tags:
 *       - cms - public
 *     responses:
 *       "200":
 *         description: A list of classrooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ClassRoom"
 *       "500":
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /public/cms/dance_category/{id}:
 *   get:
 *     tags:
 *       - cms - public
 *     summary: Get a dance category by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Autoincrement unique number of dance_category.
 *     responses:
 *       200:
 *         description: Dance category details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DanceCategoryResponse"
 */

/**
 * @swagger
 * /public/cms/dance_category:
 *   get:
 *     tags:
 *       - cms - public
 *     summary: Get a list of all dance categories.
 *     responses:
 *       200:
 *         description: A list of dance categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DanceCategoryResponse"
 */
