/**
 * @openapi
 * /order/class:
 *   post:
 *     summary: Utwórz zamówienie na zajęcia (klasę)
 *     description: >
 *       Tworzy nowe zamówienie na zajęcia dla zalogowanego studenta.  
 *       Endpoint sprawdza limit miejsc, tworzy sesję płatności w Stripe  
 *       i zapisuje ticket w bazie z oznaczeniem `PENDING`.  
 *       Zwraca URL do sesji checkout w Stripe.
 *     tags:
 *       - ClassOrders
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
 *         description: Utworzono sesję płatności
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
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 */
