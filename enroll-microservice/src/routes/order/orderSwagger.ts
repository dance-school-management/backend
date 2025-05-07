/**
 * @swagger
 * /order:
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
 *             required:
 *               - classId
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isthere:
 *                   type: boolean
 * 
 */
