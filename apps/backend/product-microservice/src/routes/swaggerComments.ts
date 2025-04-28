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


