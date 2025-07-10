#!/bin/bash

echo "🧪 Probando rutas del backend..."

API_URL="http://localhost:3001"

echo "1. Probando ruta principal..."
curl -X GET $API_URL/ -w "\nStatus: %{http_code}\n\n"

echo "2. Probando ruta de registro..."
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"12345678"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "3. Probando ruta de login..."
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "4. Probando ruta de productos..."
curl -X GET $API_URL/api/products -w "\nStatus: %{http_code}\n\n"

echo "✅ Tests completados"
