/**
 * @swagger
 * /unprotected/instructors:
 *   get:
 *     summary: Get all instructors
 *     description: >
 *       Returns a list of all users with the role of INSTRUCTOR, including their basic profile information.
 *     tags:
 *       - cms - Instructors
 *     responses:
 *       "200":
 *         description: Successfully retrieved instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 instructors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "abc123"
 *                       name:
 *                         type: string
 *                         example: "Jan"
 *                       surname:
 *                         type: string
 *                         example: "Kowalski"
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: "Specjalista od tańca współczesnego"
 *                       photo_url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://example.com/photos/instructor.jpg"
 *                       role:
 *                         type: string
 *                         enum: [INSTRUCTOR, COORDINATOR, STUDENT]
 *                         example: "INSTRUCTOR"
 *       "500":
 *         description: Internal Server Error
 */
