import React from 'react';
import AppRouter from './components/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import AppNav from './components/AppNav'

function App() {
  return (
   <BrowserRouter>
    <AppNav />
    <AppRouter />
   </BrowserRouter>
  );
}

export default App;
