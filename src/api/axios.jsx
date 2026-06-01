import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== REQUEST INTERCEPTOR ====================

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.MODE === "development") {
      console.log("📤 API Request:", {
        method: config.method.toUpperCase(),
        url: config.url,
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
    if (error.response) {
      const { status, data } = error.response;
      console.error("❌ API Error:", {
        status,
        message: data.message,
        url: error.config.url,
      });

      if (status === 401) {
        console.warn("🔓 Unauthorized - Clearing token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      if (status === 403) {
        console.warn("🚫 Forbidden - Access denied");
      }

      return Promise.reject(error);
    } else if (error.request) {
      console.error("❌ Network Error - No response from server");
      return Promise.reject(new Error("Server se response nahi aaya. Agar pehli baar open kar rahe hain toh 30-40 seconds wait karke dobara try karein (Render free tier slow start hota hai)."));
    } else {
      console.error("❌ Error:", error.message);
      return Promise.reject(error);
    }
  }
);

export default Api;