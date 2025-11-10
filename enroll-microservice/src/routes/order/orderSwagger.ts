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
 *                 example: 1
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
 *               - groupNumber
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the course to order
 *                 example: 1
 *               groupNumber:
 *                 type: integer
 *                 description: Group number identifying the set of classes
 *                 example: 1
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
