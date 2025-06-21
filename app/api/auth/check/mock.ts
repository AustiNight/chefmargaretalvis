// This is a mock implementation for the preview environment
export function mockAuthCheck() {
  return {
    authenticated: false,
    message: "Using mock authentication in preview mode",
  }
}
