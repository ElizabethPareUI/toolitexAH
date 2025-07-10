# Etapa 1: Build
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
