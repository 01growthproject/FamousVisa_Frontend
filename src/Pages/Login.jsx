import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../api/axios.jsx";
import "./Styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ GET CREDENTIALS FROM ENV VARIABLES
  const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL;
  const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8; // ✅ CHANGED FROM 6 TO 8
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter email");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!password) {
      toast.error("Please enter password");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error("Password must be at least 8 characters"); // ✅ UPDATED MESSAGE
      return;
    }

    try {
      setLoading(true);

      // ✅ CALL BACKEND API
      const res = await Api.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password,
      });

      // Store token and user
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Save email if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      toast.success("Login successful! ✅");

      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      toast.error(errorMessage);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h2>🔐 Admin Login</h2>
            <p>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">User id</label>
              <input
                id="email"
                type="email"
                placeholder={"Enter Id"} // ✅ SHOW DEMO EMAIL IN PLACEHOLDER
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
                required
              />
              {email && !isValidEmail(email) && (
                <small className="error-text">
                  Please enter a valid email address
                </small>
              )}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {password && !isValidPassword(password) && (
                <small className="error-text">
                  Password must be at least 8
                </small>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>
              <a href="/forgot-password">Forgot password?</a>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login 🚀"}
            </button>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default Login;