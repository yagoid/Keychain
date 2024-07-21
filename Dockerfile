# Utiliza una imagen oficial de Node.js como imagen base para la fase de compilación
FROM node:20-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm i

# Copia el resto de la aplicación
COPY . .

# Compila la aplicación React
RUN npm run build

# Utiliza una imagen oficial de nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos compilados desde la fase de compilación al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80 para el servidor nginx
EXPOSE 80

# Comando por defecto para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
