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
 *         isAutomatic:
 *           type: boolean
 *           example: false
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
 * /notification/management:
 *   post:
 *     summary: Create a new notification
 *     tags:
 *       - Notification - Management
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
 * /notification/status:
 *   put:
 *     summary: Update notifications read status
 *     description: Updates the `hasBeenRead` status for multiple notifications belonging to the authenticated user.
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - hasBeenRead
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: IDs of notifications to update.
 *               hasBeenRead:
 *                 type: boolean
 *                 example: true
 *                 description: The new read status (true = read, false = unread).
 *     responses:
 *       200:
 *         description: Successfully updated notifications status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 *                   description: Number of notifications updated.
 *       400:
 *         description: Bad request (invalid input data).
 *       401:
 *         description: Unauthorized (user not authenticated).
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /notification/register:
 *   post:
 *     summary: Register a device to push notifications
 *     tags:
 *       - Notification
 *     requestBody:
 *        required: false
 *        content:
 *         application/json:
 *           schema:
 *             type: object
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

/**
 * @swagger
 * /notification/toggle:
 *   post:
 *     summary: Enable or disable notifications for the current user
 *     description: Allows the authenticated user to enable or disable notifications.
 *     tags: 
 *       - Notification     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enable
 *             properties:
 *               enable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notification settings updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificationsEnabilityStatus:
 *                   type: boolean
 *                   example: true
 *       409:
 *         description: User is not registered for notifications.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /notification/status:
 *   get:
 *     summary: Get user's notification registration status
 *     description: Returns information about whether the user is registered and has enabled push notifications.
 *     tags: 
 *       - Notification
 *     responses:
 *       200:
 *         description: Successfully retrieved user's notification status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isRegistered:
 *                   type: boolean
 *                   example: true
 *                 hasEnabledNotifications:
 *                   type: boolean
 *                   example: true
 *                 isRegisteredForPushNotifications:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /notification/push/unregister:
 *   put:
 *     summary: Unregister user from push notifications
 *     description: Removes the user's Expo push token and disables further push notifications.
 *     tags: 
 *       - Notification
 *     responses:
 *       200:
 *         description: Successfully unregistered from push notifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully unregistered from push notifications
 *       409:
 *         description: User is not registered for any notifications.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /notification/management:
 *   get:
 *     summary: Get notifications (paginated) with optional sendDate filter and ownership filter
 *     description: |
 *       Returns notifications sorted by `sendDate` (descending).
 *       If `onlyOwned=true` or the authenticated user has role `INSTRUCTOR`, results are limited to notifications created by the current user.
 *     tags:
 *       - Notification - Management
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-10-11T00:00:00Z
 *         description: Min send date (inclusive). Works only when both `dateFrom` and `dateTo` are provided.
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2026-05-31T23:59:59Z
 *         description: Max send date (inclusive). Works only when both `dateFrom` and `dateTo` are provided.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of items per page
 *       - in: query
 *         name: onlyOwned
 *         schema:
 *           type: boolean
 *           example: true
 *         description: If true, returns only notifications created by the current user.
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
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized (user not authenticated)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notification/management/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags:
 *       - Notification - Management
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