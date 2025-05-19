// main.jsx
import React from 'react';
import { createContext } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css'; 
import App from './App.jsx';
import UserStore from './store/UserStore.js';
import VacancyStore from './store/VacanciesStore.js';
import ResumeStore from './store/ResumeStore.js';

export const Context = createContext(null);

// 1) Найти контейнер
const container = document.getElementById('root');

// 2) Создать root
const root = createRoot(container);

// 3) Рендерить через root.render
root.render(
  <Context.Provider value={{
    user: new UserStore(),
    vacancies: new VacancyStore(),
    resumes: new ResumeStore()
  }}>
    <App />
  </Context.Provider>
);
