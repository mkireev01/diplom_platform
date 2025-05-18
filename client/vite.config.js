import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Добавляем полифилл для process
      process: 'process/browser',
    },
  },
  define: {
    // Если вам не нужны реальные env-переменные, достаточно пустого объекта
    'process.env': {},
  },
  server: {
    proxy: {
      // Все запросы, начинающиеся на /api будут перенаправлены на backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
