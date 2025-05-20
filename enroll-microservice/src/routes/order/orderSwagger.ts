/**
 * @swagger
 * /order/class:
 *   post:
 *     summary: Creates an order for a class (private class or theme party).
 *     tags:
 *       - student
 *         - order
 *         - class
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
 *                 description: id of the class to order.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully created order for class.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order for class with 1 created successfully"
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
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 */
