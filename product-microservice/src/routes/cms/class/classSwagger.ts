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
 * /cms/class:
 *   patch:
 *     summary: Edit existing class
 *     description: >
 *       Updates an existing class.  
 *       Behavior depends on the current class status:
 *
 *       - If the class is **hidden**, full validation is performed
 *         (dates, classroom, instructors, people limits, confirmation flag).
 *       - If the class is **published** (or not hidden), only `peopleLimit`
 *         and `classRoomId` can be updated with additional business checks.
 *     tags:
 *       - cms - Classes
 *     requestBody:
 *       required: true
 *       description: Class data used to edit an existing class.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - isConfirmation
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the class that should be edited.
 *                 example: 47
 *               instructorIds:
 *                 type: array
 *                 description: >
 *                   List of instructor IDs that should be assigned to this class.
 *                 items:
 *                   type: string
 *                 example: ["13", "14"]
 *               classRoomId:
 *                 type: integer
 *                 description: ID of the classroom where the class will be held.
 *                 example: 1
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date and time of the class (ISO 8601).
 *                 example: "2026-03-10T09:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date and time of the class (ISO 8601).
 *                 example: "2026-03-10T11:00:00.000Z"
 *               peopleLimit:
 *                 type: integer
 *                 description: >
 *                   Maximum number of people allowed to enroll in the class.
 *                 example: 8
 *               isConfirmation:
 *                 type: boolean
 *                 description: >
 *                   When `true`, confirms exceeding the classroom people limit.  
 *                   When `false`, exceeding the classroom limit results in a warning/conflict.
 *                 example: false
 *     responses:
 *       200:
 *         description: >
 *           Class successfully updated.  
 *           The response body contains the updated class object
 *           (including fields such as `id`, `startDate`, `endDate`,
 *           `classRoomId`, `peopleLimit`, status and other class-related data).
 *       409:
 *         description: >
 *           Business conflict while editing the class, e.g.:
 *           - Class not found.  
 *           - Trying to decrease people limit of a published class.  
 *           - Trying to exceed classroom people limit without confirmation.  
 *           In such cases an error object is returned with a message describing the problem.
 *       500:
 *         description: >
 *           Unexpected server error.  
 *           The response body contains an error object with a generic error message.
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

/**
 * @swagger
 * /cms/class/{id}:
 *   delete:
 *     summary: Delete a class
 *     description: >
 *       Deletes a class **only if it exists** and its status is `HIDDEN`.  
 *       If the class is published, the server returns an error.
 *     tags:
 *       - cms - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *         description: ID of the class to delete
 *     responses:
 *       204:
 *         description: Class deleted successfully (no content).
 *       409:
 *         description: >
 *           Possible reasons:  
 *           - Class not found  
 *           - Class is published and cannot be deleted
 *       500:
 *         description: Unexpected server error.
 */

