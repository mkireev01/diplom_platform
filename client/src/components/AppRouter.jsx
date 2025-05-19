// src/components/AppRouter.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { publicRoutes, seekerRoutes, employerRoutes } from '../routes';

const AppRouter = observer(() => {
  const { user } = useContext(Context);

  // Если у нас ещё идёт initial check (вы завели loading в App.jsx),
  // можно захватить его из контекста или прокинуть через props.
  // Здесь я предположу, что вы сохранили его в userStore: user.loading
  if (user.loading) {
    return <div>Загрузка...</div>;
  }

  // Всегда рендерим публичные маршруты
  const routes = [...publicRoutes];

  // Если авторизован — добавляем приватные маршруты
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

      {/* Если пользователь зашёл на несуществующий маршрут — на 404 */}
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
});

export default AppRouter;
