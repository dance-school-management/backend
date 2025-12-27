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
 * /ticket/retrieve/refund:
 *   post:
 *     summary: Refund a class ticket
 *     description: |
 *       Performs a manual refund via Stripe.
 *
 *       Refund is possible only when:
 *       - ticket exists
 *       - ticket is paid (PAID or PART_OF_COURSE)
 *       - ticket is not already refunded
 *       - attendance status is not PRESENT
 *       - class status is POSTPONED
 *       - paymentIntentId exists
 *
 *       Refund amount logic:
 *       - PART_OF_COURSE -> classDetails.price
 *       - PAID -> ticket.cost
 *     tags:
 *       - student - ticket
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
 *                 format: uuid
 *                 description: QR code UUID assigned to the ticket
 *           example:
 *             qrCodeUUID: "8b0d3d3a-2f0c-4f07-a8b0-8c0b0e1d2c33"
 *     responses:
 *       200:
 *         description: Refund completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Refund successful. Refunded amount: 120 PLN"
 *
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             example:
 *               statusCode: 404
 *               message: "Ticket not found"
 *               errors:
 *                 - field: "qrCodeUUID"
 *                   message: "Not found"
 *
 *       409:
 *         description: Ticket cannot be refunded in its current state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             examples:
 *               notPaid:
 *                 value:
 *                   statusCode: 409
 *                   message: "Ticket not paid"
 *                   errors: []
 *               alreadyRefunded:
 *                 value:
 *                   statusCode: 409
 *                   message: "Ticket already refunded"
 *                   errors: []
 *               attendanceRecorded:
 *                 value:
 *                   statusCode: 409
 *                   message: "You have recorded attendance on this class. The ticket cannot be refunded"
 *                   errors: []
 *               classNotPostponed:
 *                 value:
 *                   statusCode: 409
 *                   message: "You can only get a manual refund from a postponed class"
 *                   errors: []
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             examples:
 *               missingPaymentData:
 *                 value:
 *                   statusCode: 500
 *                   message: "Payment data required for refund was not recorded"
 *                   errors: []
 *               stripeError:
 *                 value:
 *                   statusCode: 500
 *                   message: "Problem with making a refund"
 *                   errors: []
 */
