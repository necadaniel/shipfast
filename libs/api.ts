import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import config from "@/config";

// Client-side helper for calling your own API routes (/app/api/**).
// It unwraps the JSON body, surfaces errors as toasts, and bounces
// unauthenticated users to the login page.

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    // Network failure, offline, request aborted…
    const message = "Could not reach the server. Check your connection.";
    toast.error(message);
    throw new ApiError(message, 0);
  }

  const data = await response.json().catch(() => null);

  if (response.ok) return data as T;

  // Not signed in — send them to login, then back to where they were headed
  if (response.status === 401) {
    toast.error("Please login");
    await signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    throw new ApiError("Not authenticated", 401);
  }

  const message =
    (typeof data?.error === "string" ? data.error : null) ??
    (response.status === 403
      ? "Pick a plan to use this feature"
      : "Something went wrong...");

  console.error(`API ${path} failed:`, message);
  toast.error(message);

  throw new ApiError(message, response.status);
};

const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { ApiError };
export default apiClient;
