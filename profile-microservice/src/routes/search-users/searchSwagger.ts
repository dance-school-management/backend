/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search users by name, surname, email, or phone
 *     description: >
 *       Returns a list of users whose profile fields match the provided query parameters.
 *       Each query parameter is optional and uses partial matching.
 *     tags:
 *       - users
 *     parameters:
 *       - in: query
 *         name: nameQuery
 *         schema:
 *           type: string
 *         description: Part of the user's name to search for.
 *       - in: query
 *         name: surnameQuery
 *         schema:
 *           type: string
 *         description: Part of the user's surname to search for.
 *       - in: query
 *         name: emailQuery
 *         schema:
 *           type: string
 *         description: Part of the user's email to search for.
 *       - in: query
 *         name: phoneQuery
 *         schema:
 *           type: string
 *         description: Part of the user's phone number to search for.
 *     responses:
 *       200:
 *         description: List of users matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   surname:
 *                     type: string
 *                   email:
 *                     type: string
 *                     nullable: true
 *                   phone:
 *                     type: string
 *                     nullable: true
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   description:
 *                     type: string
 *                     nullable: true
 *                   photoPath:
 *                     type: string
 *                     nullable: true
 *                   favouriteDanceCategories:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   role:
 *                     type: string
 */
