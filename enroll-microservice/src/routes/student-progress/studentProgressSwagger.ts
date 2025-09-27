/**
 * @swagger
 * /progress/learnt-dance-categories:
 *   get:
 *     summary: Get dance categories learnt from finished courses (50% attendance required)
 *     description: >
 *        Returns dance categories learnt from finished courses by the logged in student,
 *        together with advancement level, date when each course was finished and names of instructors
 *        who lead each course (a learnt dance category is a dance category )
 *     tags:
 *       - student
 *         - progress
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returned student's learnt dance categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   courseId:
 *                     type: integer
 *                     example: 3
 *                   danceCategoryId:
 *                     type: integer
 *                     example: 3
 *                   danceCategoryName:
 *                     type: string
 *                     example: "HIP HOP"
 *                   advancementLevelId:
 *                     type: integer
 *                     example: 3
 *                   advancementLevelName:
 *                     type: string
 *                     example: "Advanced"
 *                   finishedDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-22T16:30:00.000Z"
 *                   instructorsNames:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "Mylene Emard"
 *                       - "Athena Gleason"
 */

/**
 * @swagger
 * /progress/courses-attendance-rates:
 *   get:
 *     summary: Get courses attendace stats
 *     description: >
 *        Returns information about student's course attendance - course name; if the course 
 *        had already started; course instructors names; number of already attended classes; number
 *        of all course classes 
 *     tags:
 *       - student
 *         - progress
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course attendance ratios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseAttendancesRates:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                         example: 4
 *                       courseName:
 *                         type: string
 *                         example: "MODERN LYRICAL JAZZ JAZZ CONTEMPORARY"
 *                       hasStarted:
 *                         type: boolean
 *                         example: false
 *                       instructorsNames:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - "Taya Hessel"
 *                       attendedCount:
 *                         type: integer
 *                         example: 0
 *                       allCount:
 *                         type: integer
 *                         example: 14
 */

/**
 * @swagger
 * /progress/hours-spent/dance-categories:
 *   get:
 *     summary: Get hours spent in school groupped by dance category
 *     description: >
 *        Returns hours spent in school groupped by dance category
 *     tags:
 *       - student
 *         - progress
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spent hours per dance category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 spentHoursStatsList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       danceCategoryName:
 *                         type: string
 *                         example: "HIP HOP"
 *                       spentHours:
 *                         type: number
 *                         format: float
 *                         example: 19.5
 */

/**
 * @swagger
 * /progress/hours-spent/instructors:
 *   get:
 *     summary: Get hours spent in school groupped by instructor
 *     description: >
 *        Returns hours spent in school groupped by instructor
 *     tags:
 *       - student
 *         - progress
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spent hours per instructor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 spentHoursStatsList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       instructorFirstname:
 *                         type: string
 *                         example: "Mylene"
 *                       instructorSurname:
 *                         type: string
 *                         example: "Emard"
 *                       spentHours:
 *                         type: number
 *                         format: float
 *                         example: 12

 */
