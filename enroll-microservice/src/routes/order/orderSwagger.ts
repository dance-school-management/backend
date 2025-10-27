/**
 * @swagger
 * /order/class:
 *   post:
 *     summary: Create a class order
 *     description: >
 *       Creates a new class order for the logged-in student.  
 *       The endpoint checks seat availability, stores a ticket in the database  
 *       with the `PENDING` payment status, and returns the class details.
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Class order created and details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         description: Unauthorized – authentication problem
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order/class/pay:
 *   post:
 *     summary: Create or retrieve Stripe Checkout Session for class payment
 *     description: >
 *       Initiates payment for a class that the logged-in student is enrolled in.  
 *       The endpoint checks if the student has already paid, or if the class was part of a course.  
 *       If no checkout session exists, it creates a new Stripe Checkout Session.  
 *       Returns the Stripe Checkout URL for payment.
 *     tags:
 *       - student - order - class
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
 *         description: Checkout session successfully created or retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: "https://checkout.stripe.com/pay/cs_test_12345"
 *       401:
 *         description: Unauthorized – authentication required
 *       409:
 *         description: Conflict – class already paid, part of a course, or not enrolled
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
 *       The endpoint checks seat availability in all classes of the selected course,  
 *       creates pending class and course tickets in the database,  
 *       and returns details about the ordered course.
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
 *                 description: The ID of the course to order.
 *                 example: 1
 *               groupNumber:
 *                 type: integer
 *                 description: Group number identifying the set of classes.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Course order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         description: One or more classes in the course are already full
 *       401:
 *         description: Unauthorized – authentication required
 *       500:
 *         description: Internal server error – failed to create course order
 */

/**
 * @swagger
 * /order/course/pay:
 *   post:
 *     summary: Create or retrieve Stripe Checkout Session for course payment
 *     description: >
 *       Initiates payment for a course that the logged-in student is enrolled in.  
 *       The endpoint checks if the student has already paid for the course.  
 *       If no checkout session exists, a new Stripe Checkout Session is created.  
 *       Returns the Stripe Checkout URL for payment.
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
 *                 description: The ID of the course to pay for.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Checkout session successfully created or retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: "https://checkout.stripe.com/pay/cs_test_12345"
 *       401:
 *         description: Unauthorized – authentication required
 *       409:
 *         description: Conflict – course already paid or not enrolled
 *       500:
 *         description: Internal server error
 */
