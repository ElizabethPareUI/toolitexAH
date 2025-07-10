#!/bin/bash

echo "🧪 TEST RÁPIDO TOOLITEX VERCEL ↔ RAILWAY"
echo "========================================"
echo ""

RAILWAY_URL="https://toolitexah-production.up.railway.app"
VERCEL_URL="https://toolitex-ah.vercel.app"

echo "✅ Tus URLs confirmadas:"
echo "📦 Backend (Railway): $RAILWAY_URL"
echo "🔺 Frontend (Vercel): $VERCEL_URL"
echo ""

# Test Backend
echo "1️⃣ Probando backend..."
response=$(curl -s "$RAILWAY_URL/")
if [[ "$response" == *"API funcionando"* ]]; then
    echo "✅ Backend OK"
else
    echo "❌ Backend FAIL: $response"
fi

# Test CORS
echo ""
echo "2️⃣ Probando CORS desde Vercel..."
response=$(curl -s -X POST "$RAILWAY_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Origin: $VERCEL_URL" \
  -d '{"name":"TestUser","email":"test@test.com","password":"TestPass123@"}' \
  -w "%{http_code}")

http_code="${response: -3}"
if [[ "$http_code" == "200" ]] || [[ "$http_code" == "400" ]]; then
    echo "✅ CORS OK (Status: $http_code)"
else
    echo "❌ CORS FAIL (Status: $http_code)"
fi

# Test Frontend
echo ""
echo "3️⃣ Probando frontend..."
response=$(curl -s -w "%{http_code}" "$VERCEL_URL/" | tail -c 3)
if [[ "$response" == "200" ]]; then
    echo "✅ Frontend OK"
else
    echo "❌ Frontend FAIL (Status: $response)"
fi

echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Ve a Vercel → Settings → Environment Variables"
echo "2. Configura: REACT_APP_API_URL=$RAILWAY_URL"
echo "3. Redeploy en Vercel"
echo "4. Intenta registrarte desde $VERCEL_URL"
echo ""
echo "🆘 Si sigue fallando, abre DevTools (F12) y revisa:"
echo "- Console tab para errores de JavaScript"
echo "- Network tab para ver qué URL se está llamando"
