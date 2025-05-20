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
 *           format: float
 *           description: New price (optional)
 *         courseStatus:
 *           type: string
 *           description: New course status (optional)
 *           enum: [HIDDEN, SALE, ONGOING, FINISHED]
 *       example:
 *         id: 1
 *         name: "Advanced Tango"
 *         description: "Updated course for advanced learners"
 *         danceCategoryId: 2
 *         advancementLevelId: 3
 *         customPrice: 1800
 *         courseStatus: "ONGOING"
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
 *       Make sure to provide all necessary fields, especially `courseStatus`, if required by validation.
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

/**
 * @swagger
 * /cms/course/{id}:
 *   delete:
 *     tags:
 *       - cms - Courses
 *     summary: Delete a course by ID
 *     description: Permanently deletes a course from the database using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to delete
 *     responses:
 *       204:
 *         description: Course successfully deleted (no content)
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
 *       400:
 *         description: Invalid course ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid course ID
 */

/**
 * @swagger
 * /cms/course/{id}:
 *   get:
 *     tags:
 *       - cms - Courses
 *     summary: Get detailed course information by ID
 *     description: >
 *       Returns detailed data about a specific course, including related class templates with classes, dance category and advancement level.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Course details with relations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 courseStatus:
 *                   type: string
 *                   enum: [HIDDEN, SALE, ONGOING, FINISHED]
 *                 customPrice:
 *                   type: number
 *                   nullable: true
 *                 danceCategory:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                 advancementLevel:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                 classTemplate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       class:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             groupNumber:
 *                               type: integer
 *                             startDate:
 *                               type: string
 *                               format: date-time
 *                             endDate:
 *                               type: string
 *                               format: date-time
 *                             peopleLimit:
 *                               type: integer
 *                             classStatus:
 *                               type: string
 *                               enum: [HIDDEN, NORMAL, CANCELLED, POSTPONED, MAKE_UP]
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course not found
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid course ID
 */
