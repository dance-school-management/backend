/**
 * @swagger
 * /trainee/schedule/daily:
*   post:
 *     summary: Get trainee's daily schedule
 *     description: Returns all scheduled classes for a given date, excluding hidden and cancelled classes.
 *     tags:
 *       - Trainee Schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date for which to fetch the schedule
 *                 example: "2025-04-26T00:00:00.000Z"
 *               studentId:
 *                 type: string
 *                 description: ID of the student
 *                 example: "student123"
 *               filters:
 *                 type: object
 *                 description: Optional filters for the schedule (currently unused)
 *     responses:
 *       200:
 *         description: Successfully fetched schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID of the class
 *                       name:
 *                         type: string
 *                         description: Name of the class template
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         description: Start date and time of the class
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         description: End date and time of the class
 *                       status:
 *                         type: string
 *                         description: Status of the class
 *                       classroom:
 *                         type: string
 *                         description: Name of the classroom
 *                       isEnroled:
 *                         type: boolean
 *                         description: Whether the student is enrolled in the class
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */