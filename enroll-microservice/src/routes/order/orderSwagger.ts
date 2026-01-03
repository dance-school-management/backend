/**
 * @swagger
 * /order/class:
 *   post:
 *     summary: Create a class order
 *     description: >
 *       Creates a new order for a single class for the logged-in student.  
 *       The endpoint verifies that the class exists, checks seat availability,  
 *       creates a pending payment record, and returns details about the class and the Stripe session.
 *     tags:
 *       - student - order - class
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
 *                 description: ID of the class to order
 *                 example: 56
 *     responses:
 *       200:
 *         description: Class order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionUrl:
 *                   type: string
 *                   format: uri
 *                   example: "https://checkout.stripe.com/pay/cs_test_12345"
 *                 className:
 *                   type: string
 *                   example: "Salsa Beginners"
 *                 classDescription:
 *                   type: string
 *                   example: "An introductory salsa class for beginners."
 *                 classStartDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-03T18:00:00Z"
 *                 classEndDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-03T19:30:00Z"
 *                 classPrice:
 *                   type: number
 *                   example: 120
 *                 classDanceCategory:
 *                   type: string
 *                   example: "Salsa"
 *                 classAdvancementLevel:
 *                   type: string
 *                   example: "Beginner"
 *       400:
 *         description: Class is full or invalid class ID
 *       401:
 *         description: Unauthorized – authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order/course:
 *   post:
 *     summary: Create a course order
 *     description: >
 *       Creates a new course order for the logged-in student.  
 *       The endpoint checks seat availability across all classes within the course,  
 *       creates a pending payment record, and returns detailed course information along with a Stripe session URL.
 *     tags:
 *       - student - order - course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the course to order
 *                 example: 4
 *     responses:
 *       200:
 *         description: Course order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionUrl:
 *                   type: string
 *                   format: uri
 *                   example: "https://checkout.stripe.com/pay/cs_test_67890"
 *                 courseName:
 *                   type: string
 *                   example: "Salsa Intensive Course"
 *                 courseDescription:
 *                   type: string
 *                   example: "A 6-week intensive salsa course for intermediate dancers."
 *                 courseDanceCategory:
 *                   type: string
 *                   example: "Salsa"
 *                 courseAdvancementLevel:
 *                   type: string
 *                   example: "Intermediate"
 *                 coursePrice:
 *                   type: number
 *                   example: 600
 *       400:
 *         description: One or more classes in the course are full
 *       401:
 *         description: Unauthorized – authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order/class/private/pay:
 *   post:
 *     summary: Initiate payment for a private dance class
 *     description: >
 *       Creates or retrieves a Stripe Checkout session for a private class payment.  
 *       The user must be authenticated and already enrolled for the given class.  
 *       Returns a Stripe session URL that can be used to complete the payment.
 *     tags:
 *       - student - payments
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
 *                 example: 107
 *                 description: Unique identifier of the class the user wants to pay for.
 *     responses:
 *       200:
 *         description: Successfully created or retrieved Stripe Checkout session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionUrl:
 *                   type: string
 *                   format: uri
 *                   example: "https://checkout.stripe.com/c/pay/cs_test_12345"
 *                   description: URL to redirect the user to Stripe Checkout.
 *                 className:
 *                   type: string
 *                   example: "Bachata Private with Anna"
 *                 classDescription:
 *                   type: string
 *                   example: "One-on-one private class focusing on body movement and musicality."
 *                 classStartDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-15T18:00:00.000Z"
 *                 classEndDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-15T19:00:00.000Z"
 *                 classPrice:
 *                   type: number
 *                   example: 150
 *                 classDanceCategory:
 *                   type: string
 *                   example: "Bachata"
 *                 classAdvancementLevel:
 *                   type: string
 *                   example: "Intermediate"
 *       400:
 *         description: Invalid checkout session in database or malformed request.
 *       401:
 *         description: User not authenticated.
 *       409:
 *         description: Conflict due to invalid payment state (already paid, refunded, wrong class type, etc.)
 *       500:
 *         description: Internal server error.
 *
 */
