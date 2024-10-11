import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../login";
import Register from "../register";
import AuthRequired from "./auth";
import Home from "../Home";
import Appointments from "../appointments"; // Add the Appointments component
import AppLayout from "../app-layout";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRequired />}>
          <Route element={<AppLayout />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/appointments" element={<Appointments />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Redirect to login if no matching route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
