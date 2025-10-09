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
 *   put:
 *     summary: Scan ticket to mark student's attendance
 *     tags:
 *       - coordinator - tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrCodeUUID
 *             properties:
 *               qrCodeUUID:
 *                 type: string
 *                 example: "some_uuid_1234"
 * 
 *     responses:
 *       "200":
 *         description: Ticket valid or attendance recorded successfully
 *       "400":
 *         description: Ticket not found
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /ticket/coordinator/scan:
 *   post:
 *     summary: Scan ticket to check if it's valid
 *     tags:
 *       - coordinator - tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrCodeUUID
 *             properties:
 *               qrCodeUUID:
 *                 type: string
 *                 example: "some_uuid_1234"
 * 
 *     responses:
 *       "200":
 *         description: Ticket valid
 *       "400":
 *         description: Ticket not found
 *       "500":
 *         description: Internal Server Error
 */
