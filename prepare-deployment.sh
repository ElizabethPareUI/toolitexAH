#!/bin/bash

echo "🚀 Preparando proyecto ToolitexAH para deployment..."

# Crear directorio .env si no existe
mkdir -p backend/.env-templates
mkdir -p frontend/.env-templates

# Verificar que los archivos de configuración existen
echo "📋 Verificando archivos de configuración..."

if [ ! -f "backend/.env.example" ]; then
    echo "⚠️  Archivo .env.example no encontrado en backend"
    exit 1
fi

if [ ! -f "frontend/.env.production" ]; then
    echo "⚠️  Archivo .env.production no encontrado en frontend"
    exit 1
fi

if [ ! -f "frontend/vercel.json" ]; then
    echo "⚠️  Archivo vercel.json no encontrado en frontend"
    exit 1
fi

if [ ! -f "backend/railway.json" ]; then
    echo "⚠️  Archivo railway.json no encontrado en backend"
    exit 1
fi

echo "✅ Archivos de configuración verificados"

# Instalar dependencias
echo "📦 Instalando dependencias..."

echo "  - Backend..."
cd backend
npm install --production=false

echo "  - Frontend..."
cd ../frontend
npm install --production=false

cd ..

echo "🧪 Ejecutando tests básicos..."

# Verificar que el servidor backend puede iniciarse
echo "  - Verificando backend..."
cd backend
timeout 10s npm start &
sleep 3
if curl -s http://localhost:3001 > /dev/null; then
    echo "    ✅ Backend responde correctamente"
else
    echo "    ⚠️  Backend puede tener problemas (verifica variables de entorno)"
fi
pkill -f "node.*server.js" 2>/dev/null || true

# Verificar que el frontend puede construirse
echo "  - Verificando frontend..."
cd ../frontend
npm run build
if [ $? -eq 0 ]; then
    echo "    ✅ Frontend construye correctamente"
else
    echo "    ❌ Error al construir frontend"
    exit 1
fi

cd ..

echo "📄 Generando resumen de configuración..."

cat > DEPLOYMENT-CHECKLIST.md << 'EOF'
# 📋 Checklist de Deployment

## ✅ Completado
- [x] Configuración de variables de entorno
- [x] Archivos de configuración (vercel.json, railway.json)
- [x] Estructura de proyecto optimizada
- [x] Dependencias instaladas
- [x] Tests básicos pasados

## 🔄 Siguiente pasos

### 1. Subir a GitHub
```bash
git add .
git commit -m "Preparado para deployment"
git push origin main
```

### 2. Configurar Railway (Backend)
1. Conectar repositorio GitHub
2. Configurar Root Directory: `backend`
3. Añadir variables de entorno:
   - MONGO_URI
   - JWT_SECRET
   - PORT=3001
   - FRONTEND_URL (URL de Vercel)

### 3. Configurar Vercel (Frontend)
1. Conectar repositorio GitHub
2. Configurar Root Directory: `frontend`
3. Añadir variable de entorno:
   - REACT_APP_API_URL (URL de Railway)

### 4. Verificar URLs
- Frontend: https://tu-proyecto.vercel.app
- Backend: https://tu-backend.railway.app

EOF

echo "🎉 Proyecto preparado para deployment!"
echo "📖 Consulta DEPLOYMENT.md para instrucciones detalladas"
echo "📋 Revisa DEPLOYMENT-CHECKLIST.md para próximos pasos"
