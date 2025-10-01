/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Edit the current user's profile
 *     description: >
 *       Allows an authenticated user to update their own profile information, including name, surname, email, phone, description, photo, and favorite dance categories.
 *       The user must be authenticated. Only their own profile can be edited.
 *     tags:
 *       - user - profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jan"
 *               surname:
 *                 type: string
 *                 example: "Kowalski"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jan.kowalski@example.com"
 *               phone:
 *                 type: string
 *                 example: "123456789"
 *               description:
 *                 type: string
 *                 example: "Modern dance instructor"
 *               favouriteDanceCategories:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 2, 3]
 *               photo:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             photo:
 *               contentType: image/png, image/jpeg, image/gif, image/jpg
 *     responses:
 *       "200":
 *         description: Profile updated successfully
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get logged in user's profile
 *     description: >
 *        Returns logged in user's profile
 *     tags:
 *       - user - profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65"
 *                     name:
 *                       type: string
 *                       example: "Jena"
 *                     surname:
 *                       type: string
 *                       example: "Pouros"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "Ilene.Weissnat@gmail.com"
 *                     phone:
 *                       type: string
 *                       example: "997.925.5907"
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     description:
 *                       type: string
 *                       example: "Aeternus vorax conservo cito possimus ustulo tolero..."
 *                     photoPath:
 *                       type: string
 *                       example: "uploads/profile_picture_3.png"
 *                     favouriteDanceCategories:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [2, 1]
 *                     role:
 *                       type: string
 *                       example: "STUDENT"
 */