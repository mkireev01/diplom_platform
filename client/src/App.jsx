import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import AppNav    from './components/AppNav';
import { Context } from './main';
import { check }   from './http/userAPI';
import axios from "axios"

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    user.setUser({});
    user.setIsAuth(false);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();      // очищает и MobX, и localStorage
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const raw = await check();
        const u   = raw.user ?? raw;
        console.log('🔄 check() payload.user:', u);

        if (u.role) {
          // только если пришла валидная роль
          user.setUser(u);
          user.setIsAuth(true);
        } else {
          // токен проверен, но роль сервер не вернул —
          // считаем, что залогинен под тем, что уже в localStorage
          user.setIsAuth(true);
        }
      } catch (e) {
        console.error('❌ check() failed:', e);
        user.logout();
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <AppNav />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
