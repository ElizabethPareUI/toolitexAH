#!/bin/bash

echo "🚀 Preparando proyecto para deployment..."

# Verificar si git está inicializado
if [ ! -d .git ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit - MERN Stack Textile B2B Platform"
fi

echo "✅ Proyecto preparado para deployment!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Sube tu código a GitHub"
echo "2. Crea cuenta en Railway.app para el backend"
echo "3. Crea cuenta en Vercel.com para el frontend"
echo "4. Configura las variables de entorno"
echo ""
echo "🔧 Variables de entorno necesarias:"
echo "Backend (Railway):"
echo "- MONGO_URI=tu_conexion_mongodb"
echo "- JWT_SECRET=tu_jwt_secret"
echo "- PORT=3001"
echo ""
echo "Frontend (Vercel):"
echo "- REACT_APP_API_URL=https://tu-backend-url.railway.app"
