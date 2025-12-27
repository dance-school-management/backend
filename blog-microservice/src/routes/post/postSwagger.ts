/**
 * @swagger
 * components:
 *   schemas:
 *     LightweightBlogPost:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Getting Started with Dance"
 *         slug:
 *           type: string
 *           example: "getting-started-with-dance"
 *         excerpt:
 *           type: string
 *           example: "A comprehensive guide to starting your dance journey"
 *         status:
 *           type: string
 *           enum:
 *             - draft
 *             - published
 *           example: "published"
 *         authorId:
 *           type: string
 *           example: "user-123"
 *         readingTime:
 *           type: integer
 *           example: 5
 *         isPinned:
 *           type: boolean
 *           example: false
 *         pinnedUntil:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["dance", "beginner", "guide"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:00:00.000Z"
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2025-01-15T10:00:00.000Z"

 *     BlogPost:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Getting Started with Dance"
 *         slug:
 *           type: string
 *           example: "getting-started-with-dance"
 *         content:
 *           type: string
 *           example: "# Getting Started\n\nWelcome to our dance school..."
 *         excerpt:
 *           type: string
 *           example: "A comprehensive guide to starting your dance journey"
 *         status:
 *           type: string
 *           enum:
 *             - draft
 *             - published
 *           example: "published"
 *         authorId:
 *           type: string
 *           example: "user-123"
 *         readingTime:
 *           type: integer
 *           example: 5
 *         isPinned:
 *           type: boolean
 *           example: false
 *         pinnedUntil:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["dance", "beginner", "guide"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:00:00.000Z"
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2025-01-15T10:00:00.000Z"
 *
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - excerpt
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *           example: "Getting Started with Dance"
 *         content:
 *           type: string
 *           minLength: 1
 *           example: "# Getting Started\n\nWelcome to our dance school..."
 *         excerpt:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           example: "A comprehensive guide to starting your dance journey"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["dance", "beginner", "guide"]
 *         status:
 *           type: string
 *           enum:
 *             - draft
 *             - published
 *           example: "draft"
 *
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *           example: "Getting Started with Dance"
 *         content:
 *           type: string
 *           minLength: 1
 *           example: "# Getting Started\n\nWelcome to our dance school..."
 *         excerpt:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           example: "A comprehensive guide to starting your dance journey"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["dance", "beginner", "guide"]
 *         status:
 *           type: string
 *           enum:
 *             - draft
 *             - published
 *           example: "published"
 *
 *     PublishPostRequest:
 *       type: object
 *       properties:
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           description: Optional scheduled publish date. If not provided, publishes immediately.
 *           example: "2025-01-20T10:00:00.000Z"
 *
 *     PinPostRequest:
 *       type: object
 *       required:
 *         - pinnedUntil
 *       properties:
 *         pinnedUntil:
 *           type: string
 *           format: date-time
 *           example: "2025-02-01T10:00:00.000Z"
 * 
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 50
 *         totalPages:
 *           type: integer
 *           example: 5
 *
 *     PaginatedPostsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogPost'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 * 
 *     PaginatedLightweightPostsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LightweightBlogPost'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new blog post
 *     description: >
 *       Creates a new blog post. If status is "published", the publishedAt date is set to now.
 *       Server automatically generates: id, slug, createdAt, updatedAt, readingTime, isPinned=false, pinnedUntil=null, authorId.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /posts/{idOrSlug}:
 *   patch:
 *     summary: Update a blog post
 *     description: >
 *       Updates a blog post. Only ADMIN role can update posts.
 *       If title changes, slug is automatically updated.
 *       If content changes, readingTime is automatically recalculated.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID or slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *
 *   get:
 *     summary: Get a single blog post (admin view)
 *     description: Returns a single blog post by ID or slug. Includes both draft and published posts.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID or slug
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *
 *   delete:
 *     summary: Delete a blog post
 *     description: Deletes a blog post by ID or slug.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID or slug
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all blog posts (admin view)
 *     description: >
 *       Returns a paginated list of lightweight blog posts. Includes both draft and published posts.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Filter by status
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query (searches title, excerpt)
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedLightweightPostsResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /posts/{idOrSlug}/publish:
 *   patch:
 *     summary: Publish a blog post
 *     description: >
 *       Publishes a blog post. If already published, returns 204 No Content.
 *       Can optionally schedule publication by providing publishedAt in the future.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID or slug
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PublishPostRequest'
 *     responses:
 *       204:
 *         description: Post published successfully or already published
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/{idOrSlug}/unpublish:
 *   patch:
 *     summary: Unpublish a blog post
 *     description: >
 *       Unpublishes a blog post (sets status to draft and clears publishedAt).
 *       If already draft, returns 204 No Content.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID or slug
 *     responses:
 *       204:
 *         description: Post unpublished successfully or already draft
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/{idOrSlug}/pin:
 *   patch:
 *     summary: Pin a blog post
 *     description: >
 *       Pins a blog post until the specified date. If already pinned, returns 204 No Content.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID or slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PinPostRequest'
 *     responses:
 *       204:
 *         description: Post pinned successfully or already pinned
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/{idOrSlug}/unpin:
 *   patch:
 *     summary: Unpin a blog post
 *     description: >
 *       Unpins a blog post. If already unpinned, returns 204 No Content.
 *     tags:
 *       - Blog Posts (Authenticated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID or slug
 *     responses:
 *       204:
 *         description: Post unpinned successfully or already unpinned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /public/posts:
 *   get:
 *     summary: Get all lightweight published posts (public)
 *     description: >
 *       Returns a paginated list of lightweight published posts that are currently visible.
 *       Posts are sorted by pinned posts first (where isPinned=true && pinnedUntil >= now),
 *       then by publishedAt descending.
 *     tags:
 *       - Blog Posts (Public)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query (searches title, excerpt)
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter posts by tag
 *     responses:
 *       200:
 *         description: Lightweight posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedLightweightPostsResponse'
 */

/**
 * @swagger
 * /public/posts/{idOrSlug}:
 *   get:
 *     summary: Get a single published post (public)
 *     description: >
 *       Returns a single published post by ID or slug.
 *       Only returns posts where status='published' and publishedAt <= now.
 *     tags:
 *       - Blog Posts (Public)
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID or slug
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Post not found or not published
 */

