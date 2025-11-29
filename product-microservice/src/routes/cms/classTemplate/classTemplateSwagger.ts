/**
 * @swagger
 * components:
 *   schemas:
 *     ClassTemplate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         courseId:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         name:
 *           type: string
 *           example: "Salsa Basics"
 *         description:
 *           type: string
 *           example: "Beginner salsa course covering basic steps and figures."
 *         price:
 *           type: number
 *           format: decimal
 *           example: 199.99
 *         danceCategoryId:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         advancementLevelId:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         classType:
 *           type: string
 *           enum:
 *             - GROUP_CLASS
 *             - PRIVATE_CLASS
 *             - THEME_PARTY
 *           example: "GROUP_CLASS"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClassTemplateInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - classType
 *         - isConfirmation
 *       properties:
 *         courseId:
 *           type: integer
 *           nullable: true
 *           description: Optional ID of the related course
 *           example: 1
 *         name:
 *           type: string
 *           description: Name of the class template
 *           example: "Salsa Basics"
 *         description:
 *           type: string
 *           description: Description of the class template
 *           example: "Beginner salsa course covering basic steps and figures."
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the class template
 *           example: 199.99
 *         danceCategoryId:
 *           type: integer
 *           nullable: true
 *           description: Optional ID of the dance category
 *           example: 2
 *         advancementLevelId:
 *           type: integer
 *           nullable: true
 *           description: Optional ID of the advancement level
 *           example: 3
 *         classType:
 *           type: string
 *           enum:
 *             - GROUP_CLASS
 *             - PRIVATE_CLASS
 *             - THEME_PARTY
 *           description: Type of the class
 *           example: "GROUP_CLASS"
 *         isConfirmation:
 *           type: boolean
 *           description: Set to true to skip name duplication check
 *           example: false
 */

/**
 * @swagger
 * /cms/class_template:
 *   post:
 *     summary: Create a new class template
 *     description: >
 *       Creates a new class template with the given data.
 *       If a template with the same name exists, set "isConfirmation: true" to override the warning.
 *     tags:
 *       - cms - ClassTemplates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassTemplateInput'
 *     responses:
 *       201:
 *         description: Class template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassTemplate'
 *       400:
 *         description: Bad request (validation failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       409:
 *         description: A class template with this name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: There is already a class template with this name
 */

/**
 * @swagger
 * /cms/class_template/{id}:
 *   put:
 *     summary: Update a class template
 *     description: Updates a class template by its ID.
 *     tags:
 *       - cms - ClassTemplates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the class template to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - classType
 *             properties:
 *               courseId:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *               name:
 *                 type: string
 *                 example: "Advanced Salsa"
 *               description:
 *                 type: string
 *                 example: "Advanced salsa class with complex moves"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 299.99
 *               danceCategoryId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               advancementLevelId:
 *                 type: integer
 *                 nullable: true
 *                 example: 3
 *               classType:
 *                 type: string
 *                 enum:
 *                   - GROUP_CLASS
 *                   - PRIVATE_CLASS
 *                   - THEME_PARTY
 *                 example: "GROUP_CLASS"
 *     responses:
 *       "200":
 *         description: Class template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClassTemplate"
 *       "400":
 *         description: Bad Request (invalid data or ID)
 *       "404":
 *         description: Class template not found
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cms/class_template/{id}:
 *   delete:
 *     summary: Delete a class template
 *     description: Deletes a class template by its ID.
 *     tags:
 *       - cms - ClassTemplates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the class template to delete
 *         example: 1
 *     responses:
 *       "200":
 *         description: Class template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClassTemplate"
 *       "400":
 *         description: Bad Request (invalid ID)
 *       "404":
 *         description: Class template not found
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cms/class_template/{id}:
 *   get:
 *     summary: Get a class template by ID
 *     description: >
 *       Retrieves a specific class template by its ID, including related dance category, advancement level, and associated classes with room details.
 *     tags:
 *       - cms - ClassTemplates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the class template
 *         example: 1
 *     responses:
 *       "200":
 *         description: Class template found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClassTemplate"
 *       "404":
 *         description: Class template not found
 *       "500":
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cms/class_template:
 *   get:
 *     summary: Get all class templates
 *     description: Retrieves a list of all available class templates, including related categories, levels, and classes with room details.
 *     tags:
 *       - cms - ClassTemplates
 *     responses:
 *       "200":
 *         description: A list of class templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ClassTemplate"
 *       "500":
 *         description: Internal Server Error
 *
 * components:
 *   schemas:
 *     ClassTemplate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Salsa Beginner Class"
 *         description:
 *           type: string
 *           example: "Basic steps and rhythm exercises"
 *         price:
 *           type: number
 *           format: decimal
 *           example: 200.00
 *         classType:
 *           type: string
 *           enum: [GROUP_CLASS, PRIVATE_CLASS, THEME_PARTY]
 *           example: "GROUP_CLASS"
 *         danceCategory:
 *           $ref: "#/components/schemas/DanceCategory"
 *         advancementLevel:
 *           $ref: "#/components/schemas/AdvancementLevel"
 *         class:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Class"
 *
 *     DanceCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Salsa"
 *         description:
 *           type: string
 *           example: "Latin American dance style"
 *         photoPath:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/salsa.jpg"

 *     AdvancementLevel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Beginner"
 *         description:
 *           type: string
 *           example: "No prior experience required"

 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         groupNumber:
 *           type: integer
 *           example: 2
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2025-06-10T18:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2025-06-10T19:30:00.000Z"
 *         peopleLimit:
 *           type: integer
 *           example: 20
 *         classStatus:
 *           type: string
 *           enum: [HIDDEN, NORMAL, CANCELLED, POSTPONED, MAKE_UP]
 *           example: "NORMAL"
 *         classRoom:
 *           $ref: "#/components/schemas/ClassRoom"

 *     ClassRoom:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: "Studio 1"
 *         peopleLimit:
 *           type: integer
 *           example: 25
 *         description:
 *           type: string
 *           example: "Spacious dance room with mirrors and sound system"
 */
