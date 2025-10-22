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
 *         title:
 *           type: string
 *           example: Nowy kurs dostępny
 *         body:
 *           type: string
 *           example: Sprawdź nasz najnowszy kurs taneczny!
 *         sendDate:
 *           type: string
 *           format: date-time
 *           example: 2023-05-15T10:00:00Z
 *         payload:
 *           type: json
 *           example: {"Hello": "World"}
 */

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Get notifications with filter by sendDate
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-10-11T00:00:00Z
 *         description: Min send date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2026-05-31T23:59:59Z
 *         description: Max send date
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
 *               - userIds
 *               - title
 *               - body
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["65", "13"]
 *               title:
 *                 type: string
 *                 example: Nowy kurs dostępny
 *               body:
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
 *               body:
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
 * /notification/register:
 *   post:
 *     summary: Register a device to push notifications
 *     tags:
 *       - push notifications
 *     requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pushToken
 *             properties:
 *               pushToken:
 *                 type: string
 *                 example: abc_123
 *     responses:
 *       204:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
