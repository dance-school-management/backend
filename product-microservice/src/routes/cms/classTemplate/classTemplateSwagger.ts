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
 *         currency:
 *           type: string
 *           example: "USD"
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
 *         scheduleTileColor:
 *           type: string
 *           nullable: true
 *           example: "#FF5733"
 */

/**
 * @swagger
 * paths:
 *   /cms/class_template:
 *     post:
 *       summary: Create a new class template
 *       description: Creates a new class template with the given data.
 *       tags:
 *         - cms - ClassTemplates
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - description
 *                 - price
 *                 - currency
 *                 - classType
 *               properties:
 *                 courseId:
 *                   type: integer
 *                   nullable: true
 *                   description: Optional ID of the related course
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Name of the class template
 *                   example: "Salsa Basics"
 *                 description:
 *                   type: string
 *                   description: Description of the class template
 *                   example: "Beginner salsa course covering basic steps and figures."
 *                 price:
 *                   type: number
 *                   format: decimal
 *                   description: Price of the class template
 *                   example: 199.99
 *                 currency:
 *                   type: string
 *                   description: Currency code (ISO 4217 format)
 *                   example: "USD"
 *                 danceCategoryId:
 *                   type: integer
 *                   nullable: true
 *                   description: Optional ID of the dance category
 *                   example: 2
 *                 advancementLevelId:
 *                   type: integer
 *                   nullable: true
 *                   description: Optional ID of the advancement level
 *                   example: 3
 *                 classType:
 *                   type: string
 *                   enum:
 *                     - GROUP_CLASS
 *                     - PRIVATE_CLASS
 *                     - THEME_PARTY
 *                   description: Type of the class
 *                   example: "GROUP_CLASS"
 *                 scheduleTileColor:
 *                   type: string
 *                   nullable: true
 *                   description: Optional color code for the schedule tile
 *                   example: "#FF5733"
 *       responses:
 *         "201":
 *           description: Class template created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ClassTemplate"
 *         "400":
 *           description: Bad Request (Invalid data)
 *         "500":
 *           description: Internal Server Error
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
 *               - currency
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
 *               currency:
 *                 type: string
 *                 example: "USD"
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
 *               scheduleTileColor:
 *                 type: string
 *                 nullable: true
 *                 example: "#FF5733"
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
 *     description: Retrieves a class template using its unique ID.
 *     tags:
 *       - cms - ClassTemplates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the class template to retrieve
 *         example: 1
 *     responses:
 *       "200":
 *         description: Class template retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClassTemplate"
 *       "400":
 *         description: Bad Request (invalid or missing ID)
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
 *     description: Retrieves a list of all available class templates.
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
 */
