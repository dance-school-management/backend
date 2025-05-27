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

