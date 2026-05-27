import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Pages/Landing.jsx";
import Login from "./Pages/Login.jsx"; // ✅ Updated component
import Home from "./Pages/Home.jsx";
import Form from "./Pages/Form.jsx";
import Admin from "./Components/Admin/Admin.jsx";
import ClientDetail from "./Components/Admin/ClientDetail.jsx";

// ✅ Optional: Forgot Password routes (if implemented)
// import { ForgotPassword, ResetPassword } from "./Pages/ForgotPasswordPages.jsx";

import ProtectedRoute from "./Pages/ProtectedRoute.jsx"; // ✅ Updated component

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Optional: Uncomment if implementing password reset */}
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> */}

        {/* ==================== PROTECTED ROUTES ==================== */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/form"
          element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/client/:id"
          element={
            <ProtectedRoute>
              <ClientDetail />
            </ProtectedRoute>
          }
        />

        {/* ==================== CATCH-ALL ROUTE ==================== */}
        {/* Redirect unknown routes to home (or landing if not logged in) */}
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        theme="light"
        hideProgressBar={false}
        newestOnTop={true}
      />
    </>
  );
};

export default App;