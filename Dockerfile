# Dockerfile
FROM node:18

# Устанавливаем Python и инструменты сборки для node‑gyp
RUN apt-get update && apt-get install -y python3 make g++ 

# Копируем ваш код
WORKDIR /app
COPY . .

# Устанавливаем зависимости и миграции
RUN npm ci
RUN npm run postinstall

# Запуск
CMD ["npm", "start"]
