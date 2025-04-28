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
 *   /cms/class_template/new:
 *     post:
 *       summary: Create a new class template
 *       description: Creates a new class template with the given data.
 *       tags:
 *         - ClassTemplates
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
