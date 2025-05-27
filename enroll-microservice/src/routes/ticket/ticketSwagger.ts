/**
 * @swagger
 * /ticket/student:
 *   get:
 *     summary: Get all class tickets for the authenticated student
 *     description: >
 *       Returns a list of class details that the currently logged-in student has tickets for.
 *       The user must be authenticated via JWT.
 *     tags:
 *       - student - ticket
 *     responses:
 *       "200":
 *         description: Successfully retrieved student class details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Salsa Beginner"
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-01T18:00:00.000Z"
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-01T19:30:00.000Z"
 *                   classRoomName:
 *                     type: string
 *                     example: "Studio 1"
 *       "401":
 *         description: Unauthorized – user not authenticated
 *       "500":
 *         description: Internal Server Error
 *
 */

/**
 * @swagger
 * /ticket/instructor/scan:
 *   post:
 *     summary: Mark student attendance by scanning ticket
 *     description: >
 *       Marks a student as present for a specific class by scanning their ticket.
 *       Requires valid `classId` and `studentId`.
 *       Fails if no ticket is found in the database.
 *     tags:
 *       - instructor - tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - studentId
 *             properties:
 *               classId:
 *                 type: integer
 *                 example: 12
 *               studentId:
 *                 type: string
 *                 example: "user_abc123"
 *     responses:
 *       "200":
 *         description: Attendance recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully recorded student's attendance"
 *       "400":
 *         description: Ticket not found (invalid studentId or classId)
 *       "500":
 *         description: Internal Server Error
 */
