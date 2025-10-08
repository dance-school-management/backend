/**
 * @swagger
 * /cms/cancel/class:
 *   post:
 *     summary: Cancel a class, send notification to students enrolled in the class about the cancellation.
 *     description: >  
 *                     Cancel a class, send notification to students enrolled in the class about the cancellation.
 *                     If `isConfirmation` field is set to false, endpoint will throw an error if the class has already started or is over.
 *                     If `isConfirmation` field is set to true, the mentioned fact will be ignored.
 *                     The assumption is, if a class is CANCELLED, all enrolled students will get a refund.
 *     tags:
 *       - cms - cancel - class
 *     requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - reason
 *               - isConfirmation
 *             properties:
 *               classId:
 *                 type: integer
 *                 example: 1
 *               reason:
 *                 type: string
 *                 example: Instructors are ill
 *               isConfirmation:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       "200":
 *         description: Ok
 */

/**
 * @swagger
 * /cms/postpone/class:
 *   post:
 *     summary: Postpone a class, send notification to students enrolled in the class about the postponement.
 *     description: >  
 *                    Postpone a class, send notification to students enrolled in the class about the postponement.
 *                    If `isConfirmation` field is set to false, endpoint will throw an error if the class has already started or is over.
 *                    If `isConfirmation` field is set to true, the mentioned fact will be ignored.
 *                    The assumption is, if a class is POSTPONED, all enrolled students have 2 options: either take a refund or 
 *                    take no action and take part in the class (they can take the refund even if the class has already started or is over, if they don't have recorded attendance)
 *     tags:
 *       - cms - postpone - class
 *     requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - reason
 *               - isConfirmation
 *               - newStartDate
 *               - newEndDate
 *             properties:
 *               classId:
 *                 type: integer
 *                 example: 1
 *               reason:
 *                 type: string
 *                 example: Instructors are ill
 *               isConfirmation:
 *                 type: boolean
 *                 example: false
 *               newStartDate: 
 *                 type: date
 *                 example: "2026-05-10T14:00:00.000Z"
 *               newEndDate:
 *                 type: date
 *                 example: "2026-05-10T15:30:00.000Z"
 *     responses:
 *       "200":
 *         description: Ok
 */