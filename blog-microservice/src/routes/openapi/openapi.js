/**
 * @openapi
 * components:
 *   schemas:
 *     BlogPost:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         content:
 *           type: string
 *         excerpt:
 *           type: string
 *         status:
 *           type: string
 *           $ref: '#/components/schemas/PostStatus'
 *         authorId:
 *           type: string
 *         readingTime:
 *           type: integer
 *         isPinned:
 *           type: boolean
 *         pinnedUntil:
 *           type: string
 *           format: date-time
 *         tags:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         publishedAt:
 *           type: string
 *           format: date-time
 *         BlogPhotosOnBlogPosts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogPhotosOnBlogPosts'
 *       required:
 *         - id
 *         - title
 *         - slug
 *         - content
 *         - excerpt
 *         - status
 *         - authorId
 *         - readingTime
 *         - isPinned
 *         - tags
 *         - createdAt
 *         - updatedAt
 *         - BlogPhotosOnBlogPosts
 *     BlogPhoto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         path:
 *           type: string
 *         BlogPhotosOnBlogPosts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogPhotosOnBlogPosts'
 *       required:
 *         - id
 *         - path
 *         - BlogPhotosOnBlogPosts
 *     BlogPhotosOnBlogPosts:
 *       type: object
 *       properties:
 *         blogPost:
 *           type: object
 *           $ref: '#/components/schemas/BlogPost'
 *         blogPostId:
 *           type: integer
 *         blogPhoto:
 *           type: object
 *           $ref: '#/components/schemas/BlogPhoto'
 *         blogPhotoId:
 *           type: integer
 *       required:
 *         - blogPost
 *         - blogPostId
 *         - blogPhoto
 *         - blogPhotoId
 *     PostStatus:
 *       type: string
 *       enum:
 *         - draft
 *         - published
 */
