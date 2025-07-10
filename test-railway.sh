#!/bin/bash

echo "🔍 Probando el deployment de Railway..."

if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar la URL de Railway"
    echo "Uso: ./test-railway.sh https://tu-proyecto.railway.app"
    exit 1
fi

RAILWAY_URL=$1

echo "🌐 Probando URL: $RAILWAY_URL"
echo ""

echo "1️⃣ Probando ruta principal..."
curl -s -w "\nStatus Code: %{http_code}\n" "$RAILWAY_URL/"
echo ""

echo "2️⃣ Probando health check..."
curl -s -w "\nStatus Code: %{http_code}\n" "$RAILWAY_URL/health"
echo ""

echo "3️⃣ Probando registro de usuario..."
curl -s -X POST "$RAILWAY_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test_'$(date +%s)'@test.com","password":"TestPass123"}' \
  -w "\nStatus Code: %{http_code}\n"
echo ""

echo "✅ Test completado. Si ves Status Code: 200 o 201, todo funciona bien!"
echo "❌ Si ves Status Code: 405, 404, o 500, revisa los logs en Railway."
