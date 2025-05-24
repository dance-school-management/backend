/**
 * @swagger
 * /cms/aggregations/class-template-creation-data:
 *   get:
 *     summary: Get all advancement levels, dance categories, and classrooms
 *     description: >
 *       Returns a list of advancement levels, dance categories, and classrooms available in the system.
 *     tags:
 *       - cms - aggregations
 *     responses:
 *       "200":
 *         description: Successfully retrieved common data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 advancementLevels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Beginner"
 *                 danceCategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Salsa"
 *                 classRooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Studio 1"
 *                       location:
 *                         type: string
 *                         example: "Main building, floor 2"
 *       "500":
 *         description: Internal Server Error
 */
