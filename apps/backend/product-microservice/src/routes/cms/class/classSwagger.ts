/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         classTemplateId:
 *           type: integer
 *           example: 2
 *         groupNumber:
 *           type: integer
 *           example: 1
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2025-05-10T14:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2025-05-10T16:00:00.000Z"
 *         peopleLimit:
 *           type: integer
 *           example: 20
 *         classRoomId:
 *           type: integer
 *           example: 5
 *         classStatus:
 *           type: string
 *           enum:
 *             - HIDDEN
 *             - NORMAL
 *             - CANCELLED
 *             - POSTPONED
 *             - MAKE_UP
 *           example: HIDDEN
 *         instructor:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               instructorId:
 *                 type: integer
 *                 example: 3
 *               classId:
 *                 type: integer
 *                 example: 1
 *         student:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 4
 *               classId:
 *                 type: integer
 *                 example: 1
 */

/**
 * @swagger
 * paths:
 *   /cms/class/new:
 *     post:
 *       summary: Create a new class
 *       description: Creates a new class with the given data, assigns instructors, and sets status to HIDDEN.
 *       tags:
 *         - cms - Classes
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - instructorIds
 *                 - classroomId
 *                 - groupNumber
 *                 - startDate
 *                 - endDate
 *                 - peopleLimit
 *                 - classTemplateId
 *               properties:
 *                 instructorIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Array of instructor IDs to assign to the class
 *                   example: [1, 2, 3]
 *                 classRoomId:
 *                   type: integer
 *                   description: ID of the classroom
 *                   example: 5
 *                 groupNumber:
 *                   type: integer
 *                   description: Number identifying the group
 *                   example: 1
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: Start date and time of the class
 *                   example: "2025-05-10T14:00:00.000Z"
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   description: End date and time of the class
 *                   example: "2025-05-10T16:00:00.000Z"
 *                 peopleLimit:
 *                   type: integer
 *                   description: Maximum number of people allowed in the class
 *                   example: 20
 *                 classTemplateId:
 *                   type: integer
 *                   description: ID of the class template
 *                   example: 2
 *       responses:
 *         "201":
 *           description: Class created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Class"
 *         "400":
 *           description: Bad Request (Invalid data)
 *         "500":
 *           description: Internal Server Error
 */

/**
 * @swagger
 * paths:
 *   /cms/class/possible_instructors:
 *     post:
 *       summary: Get possible instructor IDs
 *       description: Returns a list of unique instructor IDs that can be assigned to a class.
 *       tags:
 *         - cms - Classes
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classRoom:
 *                   type: string
 *                   description: Name or identifier of the classroom (optional for now)
 *                   example: "Studio A"
 *                 groupNumber:
 *                   type: integer
 *                   description: Group number (optional for filtering)
 *                   example: 1
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Date of the class (optional for filtering)
 *                   example: "2025-05-10"
 *                 time:
 *                   type: string
 *                   format: time
 *                   description: Time of the class (optional for filtering)
 *                   example: "14:00:00"
 *       responses:
 *         "200":
 *           description: Successfully retrieved list of instructor IDs
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     instructorId:
 *                       type: integer
 *                       example: 1
 *         "400":
 *           description: Bad Request (Invalid input)
 *         "500":
 *           description: Internal Server Error
 */
