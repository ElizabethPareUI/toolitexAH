#!/bin/bash

echo "🔄 VERIFICANDO RAILWAY DESPUÉS DE REDEPLOY"
echo "=========================================="
echo ""

RAILWAY_URL="https://toolitexah-production.up.railway.app"
VERCEL_URL="https://toolitex-ah.vercel.app"

echo "⏳ Esperando 60 segundos para que Railway termine de inicializar..."
sleep 10

for i in {1..6}; do
    echo "🔍 Intento $i/6..."
    response=$(curl -s -m 10 "$RAILWAY_URL/" 2>/dev/null)
    
    if [[ "$response" == *"API funcionando"* ]]; then
        echo "✅ Railway está funcionando!"
        echo "Response: $response"
        break
    elif [[ -n "$response" ]]; then
        echo "⚠️ Railway responde pero con contenido inesperado:"
        echo "$response" | head -3
    else
        echo "❌ Railway no responde (intento $i/6)"
    fi
    
    if [ $i -lt 6 ]; then
        echo "⏳ Esperando 10 segundos antes del siguiente intento..."
        sleep 10
    fi
done

echo ""
echo "📋 Si Railway sigue sin funcionar:"
echo "1. Revisa los logs en Railway"
echo "2. Verifica las variables de entorno"
echo "3. Considera usar el server-railway.js que creamos"
echo "4. Contacta soporte de Railway si es necesario"
