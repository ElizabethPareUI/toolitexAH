# 🚀 Guía de Deployment - Plataforma B2B Textil

## 📋 Preparación del Proyecto

### 1. **Subir a GitHub**
```bash
# Inicializar Git (si no está hecho)
git init
git add .
git commit -m "Initial commit - MERN Stack Textile B2B Platform"

# Crear repositorio en GitHub y subirlo
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main
```

### 2. **Deployment del Backend (Railway)**

1. Ve a [Railway.app](https://railway.app)
2. Regístrate con GitHub
3. Crea un nuevo proyecto
4. Conecta tu repositorio de GitHub
5. Selecciona la carpeta `backend`
6. Configura las variables de entorno:
   - `MONGO_URI`: tu conexión de MongoDB Atlas
   - `JWT_SECRET`: eliyestefi
   - `PORT`: 3001

### 3. **Deployment del Frontend (Vercel)**

1. Ve a [Vercel.com](https://vercel.com)
2. Regístrate con GitHub
3. Importa tu proyecto
4. Configura el directorio raíz como `frontend`
5. Agrega la variable de entorno:
   - `REACT_APP_API_URL`: https://tu-backend-url.railway.app

### 4. **Configuración de CORS**

Actualiza el archivo `backend/server.js` con la URL real de tu frontend:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://tu-proyecto.vercel.app', // ← Cambia esto por tu URL real
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 5. **Actualizar URLs en el Frontend**

Actualiza `frontend/.env.production`:
```
REACT_APP_API_URL=https://tu-backend-real-url.railway.app
```

## 🔧 Alternativas de Deployment

### **Opción 1: Vercel + Railway (Recomendado)**
- ✅ Fácil de usar
- ✅ Gratis para proyectos pequeños
- ✅ Integración con GitHub

### **Opción 2: Netlify + Render**
- ✅ Alternativa gratuita
- ✅ Buena documentación

### **Opción 3: Heroku**
- ⚠️ Ya no es gratis
- ✅ Todo en una plataforma

## 🌟 Para tu Portfolio

### Características destacadas:
- 🔐 **Autenticación JWT completa**
- 🛒 **Sistema de cotizaciones B2B**
- 📱 **Diseño responsive**
- 🎨 **Interfaz moderna con React + Bootstrap**
- 🔄 **Estado global con Redux**
- 📊 **Panel de administración**
- 🏢 **Portal de proveedores**
- 🔍 **Sistema de filtros avanzados**

### Tecnologías utilizadas:
- **Frontend**: React, Redux, React-Bootstrap, Sass
- **Backend**: Node.js, Express, MongoDB, JWT
- **Deployment**: Vercel, Railway
- **Database**: MongoDB Atlas

## 📝 Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Instalar dependencias
npm run install-deps

# Sembrar base de datos
npm run data:import
```

## 🔒 Seguridad

- JWT tokens para autenticación
- Variables de entorno para datos sensibles
- CORS configurado correctamente
- Validación de datos en backend

## 📞 Contacto

Para cualquier pregunta sobre el proyecto, contacta a través de tu portfolio.
