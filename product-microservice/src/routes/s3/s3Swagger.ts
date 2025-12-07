/**
 * @swagger
 * tags:
 *   name: S3
 *   description: S3 configuration
 */

/**
 * @swagger
 * /s3-endpoint:
 *   get:
 *     summary: Get S3 endpoint
 *     tags: [S3]
 *     responses:
 *       200:
 *         description: S3 endpoint
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 endpoint:
 *                   type: string
 *                   example: "https://my-bucket.s3.us-east-1.amazonaws.com/"
 */
