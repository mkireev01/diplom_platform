// main.jsx
import React from 'react';
import { createContext } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import App from './App.jsx';
import UserStore from './store/UserStore.js';
import VacancyStore from './store/VacanciesStore.js';
import ResumeStore from './store/ResumeStore.js';
import ChatStore from './store/ChatStore.js';

export const Context = createContext(null);

const root = createRoot(document.getElementById('root'));


const userStore = new UserStore();
const vacancyStore = new VacancyStore();
const resumeStore = new ResumeStore();

const chatStore = new ChatStore(userStore);

root.render(
  <Context.Provider value={{
    user: userStore,
    vacancies: vacancyStore,
    resumes: resumeStore,
    chats: chatStore
  }}>
    <App />
  </Context.Provider>
);
