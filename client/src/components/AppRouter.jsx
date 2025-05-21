// src/components/AppRouter.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { publicRoutes, seekerRoutes, employerRoutes } from '../routes';

const AppRouter = observer(() => {
  const { user } = useContext(Context);

 
  if (user.loading) {
    return <div>Загрузка...</div>;
  }

  
  const routes = [...publicRoutes];

 
  if (user.isAuth) {
    if (user.user.role === 'seeker') {
      routes.push(...seekerRoutes);
    } else if (user.user.role === 'employer') {
      routes.push(...employerRoutes);
    }
  }

  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
});

export default AppRouter;
