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
 *           example: HIDDEN
 */

/**
 * @swagger
 * /cms/class:
 *   post:
 *     summary: Create a new class
 *     description: >
 *       Creates a new class with assigned instructors, date/time, and associated template.
 *       If `peopleLimit` exceeds the classroom's limit, the request must include `isConfirmation: true` to proceed.
 *     tags:
 *       - cms - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instructorIds
 *               - classRoomId
 *               - groupNumber
 *               - startDate
 *               - endDate
 *               - peopleLimit
 *               - classTemplateId
 *               - isConfirmation
 *             properties:
 *               instructorIds:
 *                 type: array
 *                 description: IDs of instructors assigned to the class
 *                 items:
 *                   type: string
 *                 example: ["1", "2"]
 *               classRoomId:
 *                 type: integer
 *                 description: ID of the classroom where the class takes place
 *                 example: 1
 *               groupNumber:
 *                 type: integer
 *                 description: Number of the group attending the class
 *                 example: 3
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: ISO 8601 start date of the class
 *                 example: "2025-05-10T14:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: ISO 8601 end date of the class
 *                 example: "2025-05-10T16:00:00.000Z"
 *               peopleLimit:
 *                 type: integer
 *                 description: Maximum number of people allowed in the class
 *                 example: 2
 *               classTemplateId:
 *                 type: integer
 *                 description: ID of the class template associated with this class
 *                 example: 1
 *               isConfirmation:
 *                 type: boolean
 *                 description: >
 *                   Set to true to confirm creation even if peopleLimit exceeds the room capacity.
 *                   Required in such cases, otherwise the request will be rejected or ignored.
 *                 example: false
 *     responses:
 *       "201":
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Class"
 *       "400":
 *         description: Bad Request (invalid input, endDate before startDate, etc.)
 *       "409":
 *         description: Conflict (e.g. classroom or instructor is already occupied, or overlapping classes)
 *       "422":
 *         description: People limit exceeds classroom capacity, confirmation required
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cms/class/publish:
 *   patch:
 *     summary: Edit status of a class
 *     description: >
 *       Publishes a class (changes its status to normal).
 *     tags:
 *       - cms - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *             properties:
 *               classId:
 *                 type: integer
 *                 description: ID of the class to update
 *                 example: 42
 *     responses:
 *       200:
 *         description: Class status successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request (e.g., missing or invalid data)
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cms/class/{id}:
 *   get:
 *     summary: Get class details
 *     description: Returns detailed information about a specific class, including its template, course, category, level, room, and available spots.
 *     tags:
 *       - cms - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the class to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved class details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 class:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     peopleLimit:
 *                       type: integer
 *                     classTemplate:
 *                       type: object
 *                       properties:
 *                         course:
 *                           type: object
 *                           additionalProperties: true
 *                         danceCategory:
 *                           type: object
 *                           additionalProperties: true
 *                         advancementLevel:
 *                           type: object
 *                           additionalProperties: true
 *                     classRoom:
 *                       type: object
 *                       additionalProperties: true
 *                 vacancies:
 *                   type: integer
 *                   description: Number of available spots in the class
 *       404:
 *         description: Class not found
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /cms/class/available/classrooms:
 *   get:
 *     summary: Get available classrooms
 *     description: >
 *       Returns a list of classrooms that are free within the given time window (±15 minutes).
 *     tags:
 *       - cms - Availability
 *     parameters:
 *       - in: query
 *         name: startDateQ
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-05-01T00:00:00.000Z"
 *       - in: query
 *         name: endDateQ
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-05-10T16:00:00.000Z"
 *     responses:
 *       200:
 *         description: List of available classrooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 freeClassrooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Room A"
 *                       peopleLimit:
 *                         type: integer
 *                         example: 25
 *                       description:
 *                         type: string
 *                         example: "Large mirrored room with wooden floors"
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cms/class/available/instructors:
 *   get:
 *     summary: Get available instructors
 *     description: >
 *       Returns a list of instructors that are free within the given time window (±15 minutes).
 *     tags:
 *       - cms - Availability
 *     parameters:
 *       - in: query
 *         name: startDateQ
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-05-10T14:00:00.000Z"
 *       - in: query
 *         name: endDateQ
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-05-10T16:00:00.000Z"
 *     responses:
 *       200:
 *         description: List of available instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 freeInstructors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123"
 *                       name:
 *                         type: string
 *                         example: "Jane Doe"
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
