import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import CreateNews from "./pages/CreateNews";
import EditNews from "./pages/EditNews";
import AllNews from "./pages/AllNews";
import NotFound from "./pages/Notfound";
import Emails from "./pages/Emails";
import Contacts from "./pages/Contacts";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken || authToken === "") {
      toast.error("Hesaba daxil olun!");
      navigate("/", { replace: true });
    }
  }, [navigate, location]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addnews"
          element={
            <ProtectedRoute>
              <CreateNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editnews"
          element={
            <ProtectedRoute>
              <EditNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allnews"
          element={
            <ProtectedRoute>
              <AllNews />
            </ProtectedRoute>
          }
        />
            <Route
          path="/emails"
          element={
            <ProtectedRoute>
              <Emails />
            </ProtectedRoute>
          }
        />
            <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;