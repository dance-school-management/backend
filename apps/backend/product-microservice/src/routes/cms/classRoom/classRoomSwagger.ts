/**
 * @swagger
 * components:
 *   schemas:
 *     ClassRoom:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Studio A"
 *         peopleLimit:
 *           type: integer
 *           example: 30
 *         description:
 *           type: string
 *           example: "Spacious dance studio with mirrors and sound system."
 */

/**
 * @swagger
 * paths:
 *   /cms/class_room:
 *     post:
 *       summary: Create a new classroom
 *       description: Creates a new classroom with the provided name, people limit, and description.
 *       tags:
 *         - cms - ClassRooms
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - peopleLimit
 *                 - description
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the classroom
 *                   example: "Studio A"
 *                 peopleLimit:
 *                   type: integer
 *                   description: Maximum number of people allowed in the classroom
 *                   example: 30
 *                 description:
 *                   type: string
 *                   description: Description of the classroom
 *                   example: "Spacious dance studio with mirrors and sound system."
 *       responses:
 *         "201":
 *           description: Classroom created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ClassRoom"
 *         "400":
 *           description: Bad Request (Invalid data)
 *         "500":
 *           description: Internal Server Error
 */

/**
 * @swagger
 * /cms/class_room/{id}:
 *   put:
 *     summary: Edit a classroom
 *     description: Updates a classroom's name, people limit, and description by its ID.
 *     tags:
 *       - cms - ClassRooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the classroom to edit
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - peopleLimit
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the classroom
 *                 example: "Studio B"
 *               peopleLimit:
 *                 type: integer
 *                 description: Maximum number of people allowed in the classroom
 *                 example: 40
 *               description:
 *                 type: string
 *                 description: Description of the classroom
 *                 example: "Renovated room with new sound system and air conditioning."
 *     responses:
 *       "200":
 *         description: Classroom updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClassRoom"
 *       "400":
 *         description: Bad Request (invalid input)
 *       "404":
 *         description: Classroom not found
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cms/class_room/{id}:
 *   get:
 *     summary: Get a classroom by ID
 *     description: Retrieves a single classroom using its unique ID.
 *     tags:
 *       - cms - ClassRooms
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
 * /cms/class_room/{id}:
 *   delete:
 *     summary: Delete a classroom
 *     description: Deletes a classroom by its ID.
 *     tags:
 *       - cms - ClassRooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the classroom to delete
 *         example: 1
 *     responses:
 *       "204":
 *         description: Classroom deleted successfully (no content)
 *       "400":
 *         description: Bad Request (invalid or missing ID)
 *       "404":
 *         description: Classroom not found
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cms/class_room:
 *   get:
 *     summary: Get all classrooms
 *     description: Retrieves a list of all available classrooms.
 *     tags:
 *       - cms - ClassRooms
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
