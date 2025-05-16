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
 *               - classStatus
 *             properties:
 *               instructorIds:
 *                 type: array
 *                 description: IDs of instructors assigned to the class
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
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
 *                 example: 25
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
 *               classStatus:
 *                 type: string
 *                 description: Status of the class (e.g. OPEN, CANCELLED, etc.)
 *                 example: "HIDDEN"
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
 * /cms/class/{startDateFrom}/{startDateTo}:
 *   get:
 *     summary: Get schedule for classes within a date range
 *     description: >
 *       Returns a list of classes scheduled between two start dates,
 *       including course info, group number, vacancies, category details, and class status.
 *     tags:
 *       - cms - Schedule
 *     parameters:
 *       - in: path
 *         name: startDateFrom
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of the date range (inclusive)
 *         example: "2025-05-01T00:00:00.000Z"
 *       - in: path
 *         name: startDateTo
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of the date range (inclusive)
 *         example: "2025-05-31T23:59:59.000Z"
 *     responses:
 *       "200":
 *         description: List of scheduled classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedule:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-10T14:00:00.000Z"
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-10T16:00:00.000Z"
 *                       name:
 *                         type: string
 *                         example: "Salsa Basics"
 *                       groupNumber:
 *                         type: integer
 *                         example: 1
 *                       vacancies:
 *                         type: integer
 *                         example: 5
 *                       danceCategoryName:
 *                         type: string
 *                         nullable: true
 *                         example: "Salsa"
 *                       advancementLevelName:
 *                         type: string
 *                         nullable: true
 *                         example: "Beginner"
 *                       courseName:
 *                         type: string
 *                         nullable: true
 *                         example: "Salsa Beginner Course"
 *                       classStatus:
 *                         type: string
 *                         example: "HIDDEN"
 *       "400":
 *         description: Bad Request (invalid date format)
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cms/class/status/edit:
 *   put:
 *     summary: Edit status of a class
 *     description: >
 *       Updates the status of a class based on its ID.
 *       If the current status is HIDDEN and you're setting a different status than NORMAL,
 *       a confirmation flag is required.
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
 *               - newStatus
 *               - isConfirmation
 *             properties:
 *               classId:
 *                 type: integer
 *                 description: ID of the class to update
 *                 example: 42
 *               newStatus:
 *                 type: string
 *                 description: New status to set for the class
 *                 enum:
 *                   - HIDDEN
 *                   - NORMAL
 *                   - CANCELLED
 *                   - POSTPONED
 *                   - MAKE_UP
 *                 example: CANCELLED
 *               isConfirmation:
 *                 type: boolean
 *                 description: Must be true if updating from HIDDEN to any status other than NORMAL
 *                 example: false
 *     responses:
 *       200:
 *         description: Class status successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 classStatus:
 *                   type: string
 *       400:
 *         description: Bad request (e.g., missing or invalid data)
 *       404:
 *         description: Class not found
 *       409:
 *         description: Conflict — confirmation required when changing status from HIDDEN
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */