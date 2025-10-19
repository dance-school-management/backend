/**
 * @swagger
 * /private-class/class-template:
 *   post:
 *     summary: Create a private class template
 *     description: Creates a new private class template (ClassTemplate) in the database.
 *     tags:
 *       - private classes
 *     security:
 *       - bearerAuth: []  # jeśli endpoint wymaga autoryzacji JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classTemplateData
 *             properties:
 *               classTemplateData:
 *                 type: object
 *                 required:
 *                   - name
 *                   - description
 *                   - price
 *                   - currency
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Private Salsa Lesson"
 *                   description:
 *                     type: string
 *                     example: "One-on-one salsa session focusing on technique and rhythm."
 *                   price:
 *                     type: number
 *                     format: decimal
 *                     example: 150.00
 *                   currency:
 *                     type: string
 *                     example: "PLN"
 *                   danceCategoryId:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *                   advancementLevelId:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *                   scheduleTileColor:
 *                     type: string
 *                     nullable: true
 *                     example: "#FFAA00"
 *     responses:
 *       200:
 *         description: Successfully created a private class template
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Class template for private class created"
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid class data"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /private-class/class:
 *   post:
 *     summary: Create a private class
 *     description: >
 *       Creates a new private class in the system.  
 *       The endpoint checks for overlapping classes in the same classroom and instructor availability before creating the record.
 *     tags:
 *       - private classes
 *     security:
 *       - bearerAuth: []  # jeśli endpoint wymaga autoryzacji (JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classData
 *               - studentIds
 *             properties:
 *               classData:
 *                 type: object
 *                 required:
 *                   - classRoomId
 *                   - classTemplateId
 *                   - startDate
 *                   - endDate
 *                   - groupNumber
 *                   - peopleLimit
 *                 properties:
 *                   classRoomId:
 *                     type: integer
 *                     example: 5
 *                   classTemplateId:
 *                     type: integer
 *                     example: 12
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-21T17:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-21T18:00:00Z"
 *                   groupNumber:
 *                     type: integer
 *                     example: 1
 *                   peopleLimit:
 *                     type: integer
 *                     example: 2
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["uuid-student-1", "uuid-student-2"]
 *     responses:
 *       200:
 *         description: Successfully created private class
 *       409:
 *         description: Conflict — overlapping classroom or instructor schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The given classroom is occupied in the specified timespan"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid class data"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
