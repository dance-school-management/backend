/**
 * Create a mock user context header for testing
 */
export function createMockUserContext(user: {
  id: string;
  role?: string;
  email?: string;
}): string {
  const userContext = {
    id: user.id,
    role: user.role || "ADMIN",
    email: user.email || "test@example.com",
  };
  return Buffer.from(JSON.stringify(userContext)).toString("base64");
}

