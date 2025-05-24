/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Edit current user's profile
 *     description: >
 *       Allows an authenticated user to edit their own profile.  
 *       The user must send their own ID and updated profile data.  
 *       Editing another user's profile is not allowed.
 *     tags:
 *       - cms - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - surname
 *               - role
 *             properties:
 *               id:
 *                 type: string
 *                 example: "abc123"
 *               name:
 *                 type: string
 *                 example: "Jan"
 *               surname:
 *                 type: string
 *                 example: "Kowalski"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Instruktor tańca nowoczesnego"
 *               photo_url:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/images/profile.jpg"
 *     responses:
 *       "200":
 *         description: Successfully edited profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       "401":
 *         description: Unauthorized (missing or invalid user ID / editing another user's profile)
 *       "500":
 *         description: Internal Server Error
 *
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123"
 *         name:
 *           type: string
 *           example: "Jan"
 *         surname:
 *           type: string
 *           example: "Kowalski"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Instruktor z 10-letnim doświadczeniem"
 *         photo_url:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/images/jan.jpg"
 *         role:
 *           type: string
 *           enum: [INSTRUCTOR, COORDINATOR, STUDENT]
 *           example: "INSTRUCTOR"
 */
