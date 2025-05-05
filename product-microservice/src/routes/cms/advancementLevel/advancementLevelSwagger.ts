/**
 * @swagger
 * components:
 *   schemas:
 *     AdvancementLevel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Beginner
 *         description:
 *           type: string
 *           example: For students starting their dance journey
 */

/**
 * @swagger
 * /cms/advancement_level:
 *   post:
 *     summary: Create a new advancement level
 *     tags:
 *       - cms
 *         - advancement_level
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Beginner
 *               description:
 *                 type: string
 *                 example: For students starting their dance journey
 *     responses:
 *       201:
 *         description: Advancement level created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AdvancementLevel"
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /cms/advancement_level:
 *   get:
 *     summary: Get all advancement levels
 *     tags:
 *       - cms
 *         - advancement_level
 *     responses:
 *       200:
 *         description: List of advancement levels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/AdvancementLevel"
 *       404:
 *         description: No advancement levels found
 */

/**
 * @swagger
 * /cms/advancement_level/{id}:
 *   get:
 *     summary: Get advancement level by ID
 *     tags:
 *       - cms
 *         - advancement_level
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advancement level ID
 *     responses:
 *       200:
 *         description: Advancement level found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AdvancementLevel"
 *       404:
 *         description: Advancement level not found
 */

/**
 * @swagger
 * /cms/advancement_level/{id}:
 *   delete:
 *     summary: Delete advancement level by ID
 *     tags:
 *       - cms
 *         - advancement_level
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advancement level ID
 *     responses:
 *       204:
 *         description: Advancement level deleted successfully
 *       404:
 *         description: Advancement level not found
 */

/**
 * @swagger
 * /cms/advancement_level/{id}:
 *   put:
 *     summary: Update an existing advancement level
 *     tags:
 *       - cms
 *         - advancement_level
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advancement level ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Beginner
 *               description:
 *                 type: string
 *                 example: For students starting their dance journey
 *     responses:
 *       200:
 *         description: Advancement level updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AdvancementLevel"
 *       400:
 *         description: Validation error
 *       404:
 *         description: Advancement level not found
 */
