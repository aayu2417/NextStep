const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("atrp_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("atrp_token", token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("atrp_token");
    localStorage.removeItem("atrp_user");
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string) => {
      const data = await fetchWithAuth("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.access_token) {
        setAuthToken(data.access_token);
        if (typeof window !== "undefined") {
          localStorage.setItem("atrp_user", JSON.stringify(data.user));
        }
      }
      return data;
    },
    register: async (userData: any) => {
      return fetchWithAuth("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    me: async () => {
      return fetchWithAuth("/auth/me");
    },
  },

  // Jobs
  jobs: {
    list: async (filters: { q?: string; department?: string; location?: string; employment_type?: string } = {}) => {
      const params = new URLSearchParams();
      if (filters.q) params.append("q", filters.q);
      if (filters.department && filters.department !== "All") params.append("department", filters.department);
      if (filters.location) params.append("location", filters.location);
      if (filters.employment_type) params.append("employment_type", filters.employment_type);

      const qs = params.toString() ? `?${params.toString()}` : "";
      return fetchWithAuth(`/jobs${qs}`);
    },
    get: async (id: string) => {
      return fetchWithAuth(`/jobs/${id}`);
    },
    create: async (jobData: any) => {
      return fetchWithAuth("/jobs", {
        method: "POST",
        body: JSON.stringify(jobData),
      });
    },
    close: async (id: string) => {
      return fetchWithAuth(`/jobs/${id}/close`, {
        method: "PUT",
      });
    },
  },

  // Applications & ATS
  applications: {
    apply: async (formData: FormData) => {
      return fetchWithAuth("/applications/apply", {
        method: "POST",
        body: formData,
      });
    },
    my: async () => {
      return fetchWithAuth("/applications/my");
    },
    byJob: async (jobId: string) => {
      return fetchWithAuth(`/applications/job/${jobId}`);
    },
    updateStatus: async (appId: string, status: string, reason?: string) => {
      return fetchWithAuth(`/applications/${appId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status, status_reason: reason }),
      });
    },
  },

  // Interviews
  interviews: {
    schedule: async (data: any) => {
      return fetchWithAuth("/interviews/schedule", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    my: async () => {
      return fetchWithAuth("/interviews/my");
    },
    submitFeedback: async (id: string, feedback: string, recommendation: string) => {
      return fetchWithAuth(`/interviews/${id}/feedback`, {
        method: "PUT",
        body: JSON.stringify({ feedback, recommendation }),
      });
    },
  },

  // Companies
  companies: {
    list: async () => {
      return fetchWithAuth("/companies");
    },
    updateStatus: async (id: string, status: string) => {
      return fetchWithAuth(`/companies/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
  },

  // Analytics
  analytics: {
    hr: async () => {
      return fetchWithAuth("/analytics/hr");
    },
    admin: async () => {
      return fetchWithAuth("/analytics/admin");
    },
  },

  // Audit Logs
  audit: {
    list: async (limit = 50) => {
      return fetchWithAuth(`/audit?limit=${limit}`);
    },
  },
};
