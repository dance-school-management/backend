/**
 * @swagger
 * components:
 *   schemas:
 *     DanceCategory:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: name of dance category
 *         description:
 *           type: string
 *           description: description of dance category
 *       example:
 *         id: 1
 *         name: Tango
 *         description: Super dance!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     test_body:
 *       type: object
 *       required:
 *         - test
 *       properties:
 *         test:
 *           type: string
 *           description: test texty
 *       example:
 *         test: message
 */

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
 *           description: name of the course
 *       example:
 *         name: Tango
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     edited_course:
 *       type: object
 *       properties:
 *         id:
 *           type: int
 *           description: no description yet
 *         name:
 *           type: string | null
 *           description: no description yet
 *         description:
 *           type: string | null
 *           description: no description yet
 *         danceCategoryId:
 *           type: int | null
 *           description: no description yet
 *         advancementLevelId:
 *           type: int | null
 *           description: no description yet
 *         customPrice:
 *           type: int | null
 *           description: no description yet
 *       example:
 *         id: 1
 *         name: Tango course
 *         description: null
 *         danceCategoryId: null
 *         advancementLevelId: null
 *         customPrice: 1500
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     GetCourseFilter:
 *       type: object
 *       properties:
 *         danceCategoryIds:
 *           type: array | null
 *           items:
 *             type: int
 *         advancementLevelIds:
 *           type: array | null
 *           items:
 *             type: int
 *         courseStatuses:
 *           type: array | null
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
 * @openapi
 * /coordinator/dance_category:
 *   post:
 *     tags:
 *       - create
 *     summary: Dance Category creation
 *     description: Allows to create new dance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DanceCategory'
 *     responses:
 *       201:
 *         description: succesfully created
 */

/**
 * @swagger
 * /coordinator:
 *   get:
 *     tags:
 *       - Test
 *     summary: Test endpoint
 *     description: Testing docs
 *     responses:
 *       200:
 *         description: alright
 */

/**
 * @swagger
 * /coordinator:
 *  post:
 *    tags:
 *      - Test
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/test_body'
 *    summary: Test post endpoint
 *    description: Testing
 *    responses:
 *      200:
 *        description: good
 *
 */

/**
 * @swagger
 * /course/new:
 *  post:
 *    tags:
 *      - addCourse
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/new_course'
 *    summary: add new course (with hidden state), giving only a name
 *    description: No description yet
 *    responses:
 *      201:
 *        description: good
 *
 */

/**
 * @swagger
 * /course/edit:
 *  put:
 *    tags:
 *      - editCourseDetails
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/edited_course'
 *    summary: edit a course's details; provide null in a field to leave it unupdated
 *    description: No description yet
 *    responses:
 *      200:
 *        description: good
 *
 */

/**
 * @swagger
 * /course:
 *  post:
 *    tags:
 *      - getCourses
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/get_courses'
 *    summary: get all courses with filter and search
 *    description: No description yet
 *    responses:
 *      200:
 *        description: good
 *
 */
