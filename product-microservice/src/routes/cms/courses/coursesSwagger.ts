/**
 * @swagger
 * components:
 *   schemas:
 *     new_course:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the course
 *       example:
 *         name: Tango
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     edited_course:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the course to edit
 *         name:
 *           type: string
 *           description: New name (optional)
 *         description:
 *           type: string
 *           description: New description (optional)
 *         danceCategoryId:
 *           type: integer
 *           description: New dance category ID (optional)
 *         advancementLevelId:
 *           type: integer
 *           description: New advancement level ID (optional)
 *         customPrice:
 *           type: number
 *           description: New price (optional)
 *       example:
 *         id: 1
 *         name: "Tango Advanced"
 *         description: "Updated course"
 *         danceCategoryId: 3
 *         advancementLevelId: 2
 *         customPrice: 2000
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GetCourseFilter:
 *       type: object
 *       properties:
 *         danceCategoryIds:
 *           type: array
 *           nullable: true
 *           items:
 *             type: integer
 *         advancementLevelIds:
 *           type: array
 *           nullable: true
 *           items:
 *             type: integer
 *         courseStatuses:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *             enum: ["HIDDEN", "PUBLISHED"]
 *
 *     get_courses:
 *       type: object
 *       required:
 *         - filter
 *         - search_query
 *       properties:
 *         filter:
 *           $ref: '#/components/schemas/GetCourseFilter'
 *         search_query:
 *           type: string
 *           description: Search string to filter courses by name or description
 *       example:
 *         filter:
 *           danceCategoryIds: [1, 2]
 *           advancementLevelIds: [1]
 *           courseStatuses: null
 *         search_query: "tango"
 */

/**
 * @swagger
 * /cms/course/new:
 *   post:
 *     tags:
 *       - cms - Courses
 *     summary: Add new course (with hidden status), giving name and confirmation flag
 *     description: Creates a new course if a course with the same name doesn't exist or if confirmation is true.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - isConfirmation
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the course to create
 *                 example: "Tango Beginners"
 *               isConfirmation:
 *                 type: boolean
 *                 description: Set to true to override duplicate name warning
 *                 example: false
 *     responses:
 *       201:
 *         description: Course successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/edited_course'
 *       409:
 *         description: Course with the same name already exists (warning)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "There is already a course with this name"
 *       400:
 *         description: Validation error
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
 */

/**
 * @swagger
 * /cms/course/edit:
 *   put:
 *     tags:
 *       - cms - Courses
 *     summary: Edit an existing course
 *     description: >
 *       Updates a course by ID.  
 *       All fields will be updated with the provided values, including `null`.  
 *       Fields not sent will be treated as `undefined` and may result in Prisma error.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/edited_course'
 *     responses:
 *       200:
 *         description: Course successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/edited_course'
 *       400:
 *         description: Validation error (e.g. missing or invalid fields)
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
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course with this ID not found
 */


/**
 * @swagger
 * /cms/course:
 *   post:
 *     tags:
 *       - cms - Courses
 *     summary: Get all courses with filters and search
 *     description: Returns a list of courses filtered by category, level, status and search query
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/get_courses'
 *     responses:
 *       200:
 *         description: List of matching courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/edited_course'
 */
