# Используем официальный образ Node.js для сборки приложения
FROM node:16 AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Сборка приложения для продакшн
RUN npm run build

# Используем официальный образ Nginx для сервирования статических файлов
FROM nginx:stable-alpine

# Копируем собранное приложение из предыдущего шага
COPY --from=build /app/build /usr/share/nginx/html

# Копируем пользовательский конфиг Nginx (опционально)
# COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx в форграунд режиме
CMD ["nginx", "-g", "daemon off;"]
