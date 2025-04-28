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
 * @swagger
 * /cms/course/new:
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
 * /cms/course/edit:
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
 * /cms/course:
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