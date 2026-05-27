import Api from "../api/axios.jsx";

export const authService = {
  login: async (email, password) => {
    const response = await Api.post("/auth/login", {
      email: email.toLowerCase().trim(),
      password,
    });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await Api.post("/auth/register", {
      name,
      email: email.toLowerCase().trim(),
      password,
      confirmPassword: password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await Api.get("/auth/profile");
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await Api.put("/auth/change-password", {
      currentPassword,
      newPassword,
      confirmPassword: newPassword,
    });
    return response.data;
  },

  logout: async () => {
    const response = await Api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("savedEmail");
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
