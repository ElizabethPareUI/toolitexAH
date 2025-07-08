# 🚀 Guía de Deployment - ToolitexAH

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

### 2. **Configuración de MongoDB Atlas (Base de Datos)**

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (M0 Sandbox - Gratis)
4. Configura un usuario de base de datos
5. Permite conexiones desde cualquier IP (0.0.0.0/0)
6. Obtén tu string de conexión

### 3. **Deployment del Backend (Railway)**

1. Ve a [Railway.app](https://railway.app)
2. Regístrate con GitHub
3. Crea un nuevo proyecto
4. Conecta tu repositorio de GitHub
5. **CRÍTICO**: Configura **Root Directory** como `backend`
6. Configura las variables de entorno:
   - `MONGO_URI`: mongodb+srv://usuario:password@cluster.mongodb.net/toolitexah?retryWrites=true&w=majority
   - `JWT_SECRET`: eliyestefi
   - `PORT`: 3001
7. **Verificar Build Settings**:
   - Build Command: `npm ci --only=production`
   - Start Command: `node server.js`
8. Railway debería detectar automáticamente el `package.json` del backend

**⚠️ Solución de Problemas Railway:**
- Si falla el build, asegúrate de que Root Directory esté configurado como `backend`
- Verifica que las variables de entorno estén configuradas
- Si persiste el error, reinicia el deployment desde Railway

### 4. **Deployment del Frontend (Vercel)**

1. Ve a [Vercel.com](https://vercel.com)
2. Regístrate con GitHub
3. Importa tu proyecto
4. Configura:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Agrega la variable de entorno:
   - `REACT_APP_API_URL`: https://tu-backend-url.railway.app

### 5. **Configuración de CORS**

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

## 🔍 Verificación del Deployment

### **Verificar Backend (Railway)**
1. Ve a tu URL de Railway: `https://tu-backend.up.railway.app`
2. Deberías ver: "API funcionando"
3. Prueba endpoints:
   - `/api/products` - Lista de productos
   - `/api/auth/login` - Endpoint de login
   - `/api/users` - Gestión de usuarios

### **Verificar Frontend (Vercel)**
1. Ve a tu URL de Vercel: `https://tu-proyecto.vercel.app`
2. Verifica que la app cargue correctamente
3. Prueba el login/registro
4. Verifica que se conecte al backend

## 🛠️ Resolución de Problemas

### **Error de CORS**
```javascript
// En backend/server.js - Actualizar CORS
app.use(cors({
  origin: ['https://tu-frontend-vercel.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### **Error de Variables de Entorno**
- Verifica que todas las variables estén configuradas en Railway/Vercel
- Reinicia los servicios después de cambiar variables
- Revisa los logs en las plataformas

### **Error 404 en Rutas de React**
El archivo `frontend/vercel.json` ya está configurado para manejar esto.

### **Error de Base de Datos**
- Confirma que MongoDB Atlas esté configurado
- Verifica la whitelist de IPs (permite 0.0.0.0/0)
- Revisa el string de conexión

## 📱 Enlaces para tu Portfolio

### **Demo URLs**
- **Frontend**: `https://tu-proyecto.vercel.app`
- **Backend API**: `https://tu-backend.up.railway.app`

### **Repositorio**
- **GitHub**: `https://github.com/tu-usuario/toolitexah`

### **Descripción Sugerida**
```
🧵 ToolitexAH - Plataforma B2B Textil

Aplicación web full-stack para la gestión de productos textiles y cotizaciones B2B. 
Desarrollada con React, Node.js, Express y MongoDB.

✨ Características:
- Sistema de autenticación JWT
- Portal de proveedores
- Gestión de productos con filtros avanzados
- Sistema de cotizaciones
- Panel administrativo completo
- Diseño responsive

🚀 Tecnologías: React, Redux, Node.js, Express, MongoDB, JWT
🌐 Deployment: Vercel + Railway
```

## 🔄 Actualizaciones Futuras

Para actualizar tu proyecto:
1. Haz cambios en tu código local
2. Commitea y pushea a GitHub:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
3. Railway y Vercel se actualizarán automáticamente

## 📊 Monitoreo y Logs

### **Railway (Backend)**
- Ve a tu proyecto en Railway
- Sección "Deployments" para ver logs
- Sección "Metrics" para ver uso de recursos

### **Vercel (Frontend)**
- Ve a tu proyecto en Vercel
- Tab "Functions" para ver logs
- Tab "Analytics" para ver tráfico

## 🎯 Consejos para el Portfolio

1. **Usa un dominio personalizado** (opcional):
   - Vercel permite dominios personalizados gratis
   - Railway también ofrece dominios personalizados

2. **Agrega screenshots** a tu README:
   - Capturas de la interfaz principal
   - Panel de administración
   - Versión móvil

3. **Incluye métricas**:
   - Tiempo de carga
   - Tecnologías utilizadas
   - Líneas de código

4. **Documenta el proceso**:
   - Guarda este archivo DEPLOYMENT.md
   - Crea un README.md detallado

## 🚀 ¡Listo para Producción!

Tu proyecto está ahora preparado para ser desplegado y mostrado en tu portfolio. Los archivos de configuración están listos y la documentación está completa.

**Próximos pasos:**
1. Sube el código a GitHub
2. Configura Railway para el backend
3. Configura Vercel para el frontend
4. Actualiza las URLs en la configuración
5. ¡Comparte tu proyecto!

---

**¿Necesitas ayuda?** Revisa los logs de Railway y Vercel para diagnosticar cualquier problema.
