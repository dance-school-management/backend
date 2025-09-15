/**
 * @swagger
 * /order/class:
 *   post:
 *     summary: Create a class order
 *     description: >
 *       Creates a new class order for the logged-in student.  
 *       The endpoint checks seat availability, creates a payment session in Stripe,  
 *       and stores a ticket in the database with the `PENDING` status.  
 *       Returns the checkout session URL from Stripe.
 *     tags:
 *       - student
 *         - order
 *         - class
 *     security:
 *       - bearerAuth: []
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Payment session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionUrl:
 *                   type: string
 *                   format: uri
 *                   example: "https://checkout.stripe.com/pay/cs_test_12345"
 */


/**
 * @swagger
 * /order/course:
 *   post:
 *     summary: Creates an order for a course.
 *     tags:
 *       - student
 *         - order
 *         - course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - groupNumber
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: course id to order.
 *                 example: 1
 *               groupNumber:
 *                 type: integer
 *                 description: group number (it's identifier of class set).
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully created order for course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://checkout.stripe.com/pay/cs_test_12345"
 */
