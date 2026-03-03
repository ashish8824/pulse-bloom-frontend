interface ApiError {
  status?: number;
  data?: {
    message?: string;
    error?: string;
  };
}

export function parseError(error: unknown): string {
  if (!error) return "Something went wrong";

  const err = error as ApiError;

  if (err.data?.message) return err.data.message;
  if (err.data?.error) return err.data.error;
  if (err.status === 429)
    return "Too many requests. Please wait and try again.";
  if (err.status === 403) return "You don't have permission to do this.";
  if (err.status === 404) return "Resource not found.";
  if (err.status === 500) return "Server error. Please try again later.";

  return "Something went wrong. Please try again.";
}
