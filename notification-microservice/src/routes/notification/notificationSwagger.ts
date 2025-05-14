/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         productId:
 *           type: integer
 *           example: 123
 *         productType:
 *           type: string
 *           enum: [COURSE, CLASS, EVENT]
 *           example: COURSE
 *         userId:
 *           type: integer
 *           example: 456
 *         title:
 *           type: string
 *           example: Nowy kurs dostępny
 *         description:
 *           type: string
 *           example: Sprawdź nasz najnowszy kurs taneczny!
 *         hasBeenRead:
 *           type: boolean
 *           example: false
 *         sendDate:
 *           type: string
 *           format: date-time
 *           example: 2023-05-15T10:00:00Z
 */

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Get notifications with optional filtering
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter by product ID
 *       - in: query
 *         name: productType
 *         schema:
 *           type: string
 *           enum: [COURSE, CLASS, EVENT]
 *         description: Filter by product type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: hasBeenRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: sendDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by send date (YYYY-MM-DDTHH:MM:SSZ)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Notification"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Create a new notification
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - productType
 *               - userId
 *               - title
 *               - description
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 123
 *               productType:
 *                 type: string
 *                 enum: [COURSE, CLASS, EVENT]
 *                 example: COURSE
 *               userId:
 *                 type: integer
 *                 example: 456
 *               title:
 *                 type: string
 *                 example: Nowy kurs dostępny
 *               description:
 *                 type: string
 *                 example: Sprawdź nasz najnowszy kurs taneczny!
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Notification"
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /notification/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: A notification object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Notification"
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /notification/{id}:
 *   put:
 *     summary: Update notification content
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Zaktualizowany tytuł
 *               description:
 *                 type: string
 *                 example: Zaktualizowana treść powiadomienia
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Notification"
 *       400:
 *         description: Validation error
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /notification/status/{id}:
 *   put:
 *     summary: Update notification read status
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hasBeenRead
 *             properties:
 *               hasBeenRead:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notification status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Notification"
 *       400:
 *         description: Validation error
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /notification/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       204:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */