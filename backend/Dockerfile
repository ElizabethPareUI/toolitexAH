# Usar Node.js 18 Alpine para menor tamaño
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev --no-cache

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
