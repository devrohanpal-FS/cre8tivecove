const API_BASE = import.meta.env.VITE_API_BASE || "https://api.cre8tivecove.com";

let accessToken = localStorage.getItem("token") || "";

export const setToken = (token: string) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getToken = () => accessToken;

export const logout = async () => {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
  } catch (err) {
    console.error("Logout request failed:", err);
  }
  setToken("");
  window.location.href = "/admin/login";
};

// Internal fetch wrapper that handles token header and 401 refresh intercept
async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Set JSON content-type if body is JSON
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const reqOptions: RequestInit = {
    ...options,
    headers
  };

  let response = await fetch(url, reqOptions);

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setToken(data.accessToken);

        // Retry the original request with new token
        const retryHeaders = new Headers(reqOptions.headers);
        retryHeaders.set("Authorization", `Bearer ${data.accessToken}`);
        reqOptions.headers = retryHeaders;

        response = await fetch(url, reqOptions);
      } else {
        // Refresh token failed/expired
        setToken("");
      }
    } catch (refreshErr) {
      console.error("Error refreshing token:", refreshErr);
      setToken("");
    }
  }

  return response;
}

export const api = {
  get: async (endpoint: string) => {
    const res = await fetchWithRetry(`${API_BASE}${endpoint}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  post: async (endpoint: string, body: any) => {
    const isFormData = body instanceof FormData;
    const res = await fetchWithRetry(`${API_BASE}${endpoint}`, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  put: async (endpoint: string, body: any) => {
    const isFormData = body instanceof FormData;
    const res = await fetchWithRetry(`${API_BASE}${endpoint}`, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  delete: async (endpoint: string) => {
    const res = await fetchWithRetry(`${API_BASE}${endpoint}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  }
};
