import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.blogPost.create({
    data: {
      title: "Welcome to Our Blog",
      slug: "welcome-to-our-blog",
      content: "# Welcome\n\nThis is our first blog post...",
      excerpt: "A warm welcome to our blog",
      status: "published",
      authorId: "user-123",
      readingTime: 2,
      isPinned: false,
      tags: ["welcome", "announcement"],
      publishedAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

