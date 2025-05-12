import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, seekerRoutes } from "../routes";
import { Context } from "../main";

const AppRouter = () => {
  const {user} = useContext(Context)

  console.log(user)
  return (
    <Routes>
      {user.isAuth &&
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
