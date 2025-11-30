/**
 * @swagger
 * tags:
 *   name: Photo
 *   description: Photo management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadPhotoResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         path:
 *           type: string
 *           example: "public/photo-12345.jpg"
 *     GetPhotoResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         path:
 *           type: string
 *           example: "public/photo-12345.jpg"
 */

/**
 * @swagger
 * /photo:
 *   post:
 *     summary: Uploads a single photo
 *     tags: [Photo]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: The photo file to upload
 *     responses:
 *       "201":
 *         description: The photo was successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadPhotoResponse'
 *
 *       "400":
 *         description: Bad request, e.g., missing file
 *
 *   get:
 *     summary: Gets a photo record by ID (as a query parameter)
 *     tags: [Photo]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The photo record ID
 *     responses:
 *       "200":
 *         description: Successfully retrieved the photo record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetPhotoResponse'
 *       "400":
 *         description: Bad request, e.g., missing ID
 *       "404":
 *         description: Photo with the given ID does not exist
 *   delete:
 *     summary: Deletes a photo record
 *     tags: [Photo]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The ID of the photo record to delete
 *     responses:
 *       "204":
 *         description: Successfully deleted the photo record
 *       "400":
 *         description: Bad request, e.g., missing ID
 *       "404":
 *         description: Photo with the given ID does not exist
 *       "500":
 *         description: Failed to delete photo from storage
 */

/**
 * @swagger
 * /photo/multiple:
 *   post:
 *     summary: Uploads multiple photos
 *     tags: [Photo]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The photo files to upload
 *     responses:
 *       "201":
 *         description: The photos were successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UploadPhotoResponse'
 *       "400":
 *         description: Bad request, e.g., missing files
 */
