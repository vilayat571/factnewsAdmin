import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import CreateNews from "./pages/CreateNews";
import EditNews from "./pages/EditNews";
import AllNews from "./pages/AllNews";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addnews" element={<CreateNews />} />
        <Route path="/editnews" element={<EditNews />} />
        <Route path="/allnews" element={<AllNews />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
