export async function parseApiError(
  res: Response,
  fallback = "Something went wrong. Please try again."
): Promise<string> {
  const text = await res.text();
  if (!text) return fallback;

  try {
    const data = JSON.parse(text) as { message?: string; error?: unknown };
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
  } catch {
    if (text.trim()) return text;
  }

  return fallback;
}
