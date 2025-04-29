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
 *   /cms/class_room/new:
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
