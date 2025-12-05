/**
 * @swagger
 * /private-class/class-template:
 *   post:
 *     summary: Create a private class template
 *     tags:
 *       - Private Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classTemplateData:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Salsa On2 – Beginner Private"
 *                   description:
 *                     type: string
 *                     example: "Private introduction to Salsa On2 fundamentals."
 *                   danceCategoryId:
 *                     type: integer
 *                     format: int32
 *                     example: 1
 *                   advancementLevelId:
 *                     type: integer
 *                     format: int32
 *                     example: 1
 *                   price:
 *                     type: number
 *                     example: 180
 *                 required:
 *                   - name
 *                   - danceCategoryId
 *                   - advancementLevelId
 *                   - price
 *     responses:
 *       200:
 *         description: Private class template created
 *       409:
 *         description: Conflict (validation issue)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /private-class/class-template:
 *   put:
 *     summary: Edit an existing private class template
 *     tags:
 *       - Private Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classTemplateData:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     format: int32
 *                     example: 10
 *                   name:
 *                     type: string
 *                     example: "Salsa On2 – Intermediate Private"
 *                   description:
 *                     type: string
 *                     example: "Private lesson focused on partnerwork and shines."
 *                   danceCategoryId:
 *                     type: integer
 *                     format: int32
 *                     example: 1
 *                   advancementLevelId:
 *                     type: integer
 *                     format: int32
 *                     example: 2
 *                   price:
 *                     type: number
 *                     example: 220
 *                 required:
 *                   - id
 *     responses:
 *       200:
 *         description: Private class template edited
 *       409:
 *         description: Template not found or conflict
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /private-class/class-template:
 *   get:
 *     summary: Get private class templates created by the current instructor
 *     tags:
 *       - Private Classes
 *     responses:
 *       200:
 *         description: List of private class templates created by the instructor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     format: int32
 *                     example: 10
 *                   name:
 *                     type: string
 *                     example: "Salsa On2 – Beginner Private"
 *                   description:
 *                     type: string
 *                     example: "Private introduction to Salsa On2 fundamentals."
 *                   danceCategoryId:
 *                     type: integer
 *                     format: int32
 *                     nullable: true
 *                     example: 1
 *                   advancementLevelId:
 *                     type: integer
 *                     format: int32
 *                     nullable: true
 *                     example: 1
 *                   classType:
 *                     type: string
 *                     example: "PRIVATE_CLASS"
 *                   price:
 *                     type: number
 *                     example: 180
 *                   createdBy:
 *                     type: string
 *                     nullable: true
 *                     example: "instructor_123"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /private-class/class-template/{id}:
 *   get:
 *     summary: Get details of a class template created by the authenticated instructor
 *     description: Returns details of a private class template belonging to the authenticated instructor.
 *     tags:
 *       - Private Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the class template
 *     responses:
 *       200:
 *         description: Successfully returned class template details
 *       409:
 *         description: Class template not found for the given instructor and id
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /private-class/class:
 *   post:
 *     summary: Create a private class for given students based on a template
 *     tags:
 *       - Private Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classData:
 *                 type: object
 *                 properties:
 *                   classTemplateId:
 *                     type: integer
 *                     format: int32
 *                     example: 25
 *                   classRoomId:
 *                     type: integer
 *                     format: int32
 *                     example: 2
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-02-14T18:00:00.000Z"
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-02-14T19:00:00.000Z"
 *                   groupNumber:
 *                     type: integer
 *                     format: int32
 *                     example: 1
 *                   peopleLimit:
 *                     type: integer
 *                     format: int32
 *                     example: 2
 *                 required:
 *                   - classTemplateId
 *                   - classRoomId
 *                   - startDate
 *                   - endDate
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "stud_101"
 *                 example:
 *                   - "stud_101"
 *                   - "stud_202"
 *                 description: List of student IDs invited to the private class
 *     responses:
 *       200:
 *         description: Private class created
 *       409:
 *         description: Validation conflict (occupied room, instructor, student overlap)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /private-class/class:
 *   put:
 *     summary: Edit an existing private class
 *     tags:
 *       - Private Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classData:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     format: int32
 *                     example: 55
 *                   classTemplateId:
 *                     type: integer
 *                     format: int32
 *                     example: 25
 *                   classRoomId:
 *                     type: integer
 *                     format: int32
 *                     example: 3
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-01T17:00:00.000Z"
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-01T18:00:00.000Z"
 *                   groupNumber:
 *                     type: integer
 *                     format: int32
 *                     example: 1
 *                 required:
 *                   - id
 *                   - classTemplateId
 *                   - classRoomId
 *                   - startDate
 *                   - endDate
 *     responses:
 *       200:
 *         description: Private class updated
 *       409:
 *         description: Conflict (overlaps, invalid template, etc.)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /private-class/class:
 *   get:
 *     summary: Get private classes created by the current instructor
 *     tags:
 *       - Private Classes
 *     responses:
 *       200:
 *         description: List of private classes created by the instructor
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /private-class/class/{id}:
 *   get:
 *     summary: Get details of a private class created by the authenticated instructor
 *     description: Returns details of a private class that belongs to the authenticated instructor.
 *     tags:
 *       - Private Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the private class
 *     responses:
 *       200:
 *         description: Successfully returned private class details
 *       409:
 *         description: Private class not found for the given instructor and id
 *       401:
 *         description: Unauthorized
 */
