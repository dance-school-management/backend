/**
 * @swagger
 * /ticket/retrieve:
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
 * /ticket/scan:
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
 * /ticket/scan:
 *   get:
 *     summary: Scan ticket to check if it's valid
 *     tags:
 *       - coordinator - tickets
 *     parameters:
 *       - in: query
 *         name: qrCodeUUID
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the qr code
 *         example: abc12934n1woni1fi
 *     responses:
 *       "200":
 *         description: Ticket valid
 *       "400":
 *         description: Ticket not found
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /ticket/retrieve/courses:
 *   get:
 *     summary: Get all course tickets for the logged-in student
 *     description: Returns a list of all course tickets assigned to the authenticated student, including course details and payment status.
 *     tags:
 *       - student - ticket
 *     responses:
 *       200:
 *         description: List of student's course tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                         example: "c12345"
 *                       name:
 *                         type: string
 *                         example: "Salsa Beginners"
 *                       description:
 *                         type: string
 *                         example: "An introductory salsa course for beginners."
 *                       danceCategoryName:
 *                         type: string
 *                         example: "Salsa"
 *                       advancementLevelName:
 *                         type: string
 *                         example: "Beginner"
 *                       price:
 *                         type: number
 *                         example: 250
 *                       paymentStatus:
 *                         type: string
 *                         enum: [PAID, UNPAID, PENDING]
 *                         example: "PAID"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Internal server error
 */