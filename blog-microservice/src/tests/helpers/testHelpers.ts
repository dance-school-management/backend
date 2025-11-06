/**
 * Create a mock user context header for testing
 */
export function createMockUserContext(user: {
  id: string;
  role: string;
  email: string;
}): string {
  const userContext = {
    id: user.id,
    role: user.role,
    email: user.email,
  };
  return Buffer.from(JSON.stringify(userContext)).toString("base64");
}

