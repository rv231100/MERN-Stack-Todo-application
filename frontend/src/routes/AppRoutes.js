import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import Tasks from "../pages/Tasks";
import Kanban from "../pages/Kanban";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* all routes inside this section require login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* We'll add these pages in later phases. */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/kanban" element={<Kanban />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Route>
        </Route>

        {/* default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* unknown route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
