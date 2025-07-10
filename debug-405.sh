#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO ERROR 405 VERCEL ↔ RAILWAY"
echo "=================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar URL
check_url() {
    local url=$1
    local description=$2
    
    echo -e "${YELLOW}🔍 Probando: $description${NC}"
    echo "URL: $url"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url" 2>/dev/null)
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS:.*//')
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✅ SUCCESS (${http_code})${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}❌ FAILED (${http_code})${NC}"
        echo "Response: $body"
    fi
    echo ""
}

# Función para probar POST
test_post() {
    local url=$1
    local description=$2
    local origin=$3
    
    echo -e "${YELLOW}🔍 Probando POST: $description${NC}"
    echo "URL: $url"
    echo "Origin: $origin"
    
    if [ -n "$origin" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -H "Origin: $origin" \
            -d '{"name":"Test User","email":"test_'$(date +%s)'@test.com","password":"TestPass123"}' 2>/dev/null)
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d '{"name":"Test User","email":"test_'$(date +%s)'@test.com","password":"TestPass123"}' 2>/dev/null)
    fi
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS:.*//')
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✅ SUCCESS (${http_code})${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}❌ FAILED (${http_code})${NC}"
        echo "Response: $body"
    fi
    echo ""
}

# Solicitar URLs
echo "Por favor, proporciona las siguientes URLs:"
echo ""
read -p "🚂 URL de Railway (ej: https://xxxxx.railway.app): " RAILWAY_URL
read -p "🔺 URL de Vercel (ej: https://xxxxx.vercel.app): " VERCEL_URL

echo ""
echo "🧪 INICIANDO DIAGNÓSTICO..."
echo ""

# 1. Probar Railway básico
check_url "$RAILWAY_URL/" "Railway - Ruta raíz"

# 2. Probar health check
check_url "$RAILWAY_URL/health" "Railway - Health check"

# 3. Probar POST sin origin
test_post "$RAILWAY_URL/api/auth/register" "Railway - Registro sin origin" ""

# 4. Probar POST con origin de Vercel
test_post "$RAILWAY_URL/api/auth/register" "Railway - Registro con origin Vercel" "$VERCEL_URL"

# 5. Probar Vercel
check_url "$VERCEL_URL/" "Vercel - Frontend"

echo "🔬 DIAGNÓSTICO COMPLETADO"
echo ""
echo "📝 ANÁLISIS:"
echo "- Si Railway funciona pero Vercel no → Problema en REACT_APP_API_URL"
echo "- Si Railway da 405 → Problema en el backend"
echo "- Si Railway da CORS error → Problema en FRONTEND_URL"
echo "- Si todo da error → Verificar deployments"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Si Railway funciona: Actualizar REACT_APP_API_URL en Vercel"
echo "2. Si hay CORS: Actualizar FRONTEND_URL en Railway"  
echo "3. Si Railway falla: Revisar logs y redeploy"
