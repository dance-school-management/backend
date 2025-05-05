/**
 * @swagger
 * components:
 *   schemas:
 *     DanceCategoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Autoincrement generated id.
 *           example: 1
 *         photoPath:
 *           type: string
 *           description: Relative path to photo on server.
 *           example: "uploads/photo-1744550331475-448699340.JPG"
 *         name:
 *           type: string
 *           description: Name of the dance category.
 *           example: "Salsa"
 *         description:
 *           type: string
 *           description: Description of the dance category.
 *           example: Energetic partner dance originating from Cuba.
 */

/**
 * @swagger
 * /cms/dance_category:
 *   post:
 *     tags:
 *       - cms
 *         - dance_category
 *     summary: Create a new dance category.
 *     requestBody:
 *       description: Basic information for dance category.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: The category photo file (upload).
 *               name:
 *                 type: string
 *                 description: Name of the dance category. Must not be empty.
 *                 example: Salsa
 *               description:
 *                 type: string
 *                 description: Description of the dance category. Must not be empty.
 *                 example: Energetic partner dance originating from Cuba.
 *           encoding:
 *             photo:
 *               contentType: image/png, image/jpeg, image/gif, image/jpg
 *     responses:
 *       201:
 *         description: Dance category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DanceCategoryResponse"
 */

/**
 * @swagger
 * /cms/dance_category/{id}:
 *   get:
 *     tags:
 *       - cms
 *         - dance_category
 *     summary: Get a dance category by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Autoincrement unique number of dance_category.
 *     responses:
 *       200:
 *         description: Dance category details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DanceCategoryResponse"
 */

/**
 * @swagger
 * /cms/dance_category:
 *   get:
 *     tags:
 *       - cms
 *         - dance_category
 *     summary: Get a list of all dance categories.
 *     responses:
 *       200:
 *         description: A list of dance categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DanceCategoryResponse"
 */

/**
 * @swagger
 * /cms/dance_category/{id}:
 *   delete:
 *     tags:
 *       - cms
 *         - dance_category
 *     summary: Delete a dance category by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Autoincrement unique number of dance_category.
 *     responses:
 *       204:
 *         description: Dance category deleted successfully. No content returned.
 *       404:
 *         description: Dance category not found.
 */

/**
 * @swagger
 * /cms/dance_category/{id}:
 *   put:
 *     tags:
 *       - cms
 *         - dance_category
 *     summary: Update an existing dance category by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Unique identifier of the dance category.
 *     requestBody:
 *       description: Data for updating the dance category.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: The new category photo file (upload).
 *               name:
 *                 type: string
 *                 description: Name of the dance category. Must not be empty.
 *                 example: Salsa
 *               description:
 *                 type: string
 *                 description: Description of the dance category. Must not be empty.
 *                 example: Energetic partner dance originating from Cuba.
 *           encoding:
 *             photo:
 *               contentType: image/png, image/jpeg, image/gif, image/jpg
 *     responses:
 *       200:
 *         description: Dance category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DanceCategoryResponse"
 *       404:
 *         description: Dance category not found.
 */
