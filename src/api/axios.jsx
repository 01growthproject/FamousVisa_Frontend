import axios from "axios";

// ✅ Set base URL based on environment
const baseURL =
  import.meta.env.MODE === "production"
    ? "https://your-production-api.com"
    : "http://localhost:5000/api";

// ✅ Create axios instance
const Api = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== REQUEST INTERCEPTOR ====================

Api.interceptors.request.use(
  (config) => {
    // ✅ Add JWT token from localStorage to every request
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Log request in development
    if (import.meta.env.MODE === "development") {
      console.log("📤 API Request:", {
        method: config.method.toUpperCase(),
        url: config.url,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================

Api.interceptors.response.use(
  (response) => {
    // ✅ Log response in development
    if (import.meta.env.MODE === "development") {
      console.log("📥 API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // ✅ Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      console.error("❌ API Error:", {
        status: status,
        message: data.message,
        detail: data.error,
        url: error.config.url,
      });

      // ✅ Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        console.warn("🔓 Unauthorized - Clearing token and redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect to login (if not already on login page)
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // ✅ Handle 403 Forbidden
      if (status === 403) {
        console.warn("🚫 Forbidden - Access denied");
      }

      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      console.error("❌ Network Error - No response from server");
      return Promise.reject(
        new Error("Network error: No response from server")
      );
    } else {
      // Error in request setup
      console.error("❌ Error:", error.message);
      return Promise.reject(error);
    }
  }
);

export default Api;