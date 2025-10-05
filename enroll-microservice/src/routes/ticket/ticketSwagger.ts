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
 *       "401":
 *         description: Unauthorized – user not authenticated
 *       "500":
 *         description: Internal Server Error
 *
 */

/**
 * @swagger
 * /ticket/coordinator/scan:
 *   post:
 *     summary: Mark student attendance by scanning ticket
 *     description: >
 *       Marks a student as present for a specific class by scanning their ticket.
 *       Requires valid `classId`, `studentId` and `qrCodeUUID`.
 *       Fails if no ticket is found in the database.
 *       If isConfirmation is set to `false`, attendance is not recorded. Otherwise, it is.
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
 *               - qrCodeUUID
 *               - isConfirmation
 *             properties:
 *               classId:
 *                 type: integer
 *                 example: 12
 *               studentId:
 *                 type: string
 *                 example: "user_abc123"
 *               qrCodeUUID:
 *                 type: string
 *                 example: "some_uuid_1234"
 *               isConfirmation:
 *                 type: boolean
 *                 example: false
 * 
 *     responses:
 *       "200":
 *         description: Ticket valid or attendance recorded successfully
 *       "400":
 *         description: Ticket not found
 *       "500":
 *         description: Internal Server Error
 */
