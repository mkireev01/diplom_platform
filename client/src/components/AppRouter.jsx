import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, seekerRoutes } from "../routes";

const AppRouter = () => {
  const isAuth = false;

  return (
    <Routes>
      {isAuth &&
        publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))
      }

      {/* Редирект всех остальных */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
