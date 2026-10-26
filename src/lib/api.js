
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const { headers, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    // Handle responses that don't contain JSON.
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}
