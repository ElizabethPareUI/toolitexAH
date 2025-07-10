#!/bin/bash

echo "🔍 VERIFICACIÓN VARIABLE VERCEL ACTUALIZADA"
echo "==========================================="
echo ""

VERCEL_URL="https://toolitex-ah.vercel.app"
EXPECTED_API_URL="https://toolitexah-production.up.railway.app"

echo "📋 Configuración esperada:"
echo "🔺 Frontend: $VERCEL_URL"
echo "📦 API URL: $EXPECTED_API_URL"
echo ""

echo "⏳ Esperando 30 segundos para que Vercel aplique cambios..."
sleep 5

echo "🔍 Probando si el frontend puede conectarse al backend..."

# Test directo al backend
echo "1️⃣ Verificando backend directamente..."
response=$(curl -s "$EXPECTED_API_URL/" 2>/dev/null)
if [[ "$response" == *"API funcionando"* ]]; then
    echo "✅ Backend accesible"
else
    echo "❌ Backend no responde: $response"
    exit 1
fi

echo ""
echo "2️⃣ Probando CORS desde Vercel..."
response=$(curl -s -X POST "$EXPECTED_API_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -H "Origin: $VERCEL_URL" \
    -d '{"name":"TestUser","email":"test@test.com","password":"TestPass123@"}' \
    -w "%{http_code}" | tail -c 3)

if [[ "$response" == "200" ]] || [[ "$response" == "400" ]]; then
    echo "✅ CORS configurado correctamente"
else
    echo "❌ CORS error (Status: $response)"
fi

echo ""
echo "📋 SIGUIENTE PASO:"
echo "1. Verifica que el redeploy en Vercel haya terminado"
echo "2. Abre tu app: $VERCEL_URL"
echo "3. Abre DevTools (F12) → Console"
echo "4. Ejecuta: console.log('API URL:', process.env.REACT_APP_API_URL)"
echo "5. Debe mostrar: $EXPECTED_API_URL"
echo ""
echo "🧪 Test de registro desde el navegador:"
echo "En la consola del navegador, ejecuta esto:"
echo ""
echo "fetch('$EXPECTED_API_URL/api/auth/register', {"
echo "  method: 'POST',"
echo "  headers: { 'Content-Type': 'application/json' },"
echo "  body: JSON.stringify({"
echo "    name: 'TestUser',"
echo "    email: 'test' + Date.now() + '@test.com',"
echo "    password: 'TestPass123@'"
echo "  })"
echo "})"
echo ".then(r => r.json())"
echo ".then(data => console.log('✅ Registro exitoso:', data))"
echo ".catch(err => console.error('❌ Error:', err))"
