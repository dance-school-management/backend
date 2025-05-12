/**
 * @swagger
 * /order/class:
 *   post:
 *     summary: Create an order for a class
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: number
 *                 description: The ID of the class to order
 *                 example: 1
 *               studentId:
 *                 type: number
 *                 description: The ID of the student placing the order
 *                 example: 1
 *             required:
 *               - classId
 *               - studentId
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_valid:
 *                   type: boolean
 */

/**
 * @swagger
 * /order/course:
 *   post:
 *     summary: Create an order for a course
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: number
 *                 description: The ID of the class to order
 *                 example: 1
 *               studentId:
 *                 type: number
 *                 description: The ID of the student placing the order
 *                 example: 1
 *             required:
 *               - courseId
 *               - studentId
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_valid:
 *                   type: boolean
 */

