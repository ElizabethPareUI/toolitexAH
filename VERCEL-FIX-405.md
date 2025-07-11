# 🔧 SOLUCIÓN ERROR 405 EN VERCEL

## ❌ PROBLEMA IDENTIFICADO
El error "Request failed with status code 405" en Vercel significa que:
1. Tu frontend está intentando conectarse a una URL incorrecta del backend
2. El backend no está respondiendo correctamente
3. Hay un problema de CORS entre Vercel y Railway

## ✅ SOLUCIÓN PASO A PASO

### 1. **Obtener la URL real de tu backend en Railway**
1. Ve a [Railway](https://railway.app)
2. Entra a tu proyecto
3. Ve a la pestaña de tu servicio backend
4. Busca la URL que aparece como: `https://XXXXXXXXX.railway.app`
5. **Guarda esta URL** - la necesitarás

### 2. **Probar que tu backend funciona**
```bash
# Reemplaza TU-URL-RAILWAY por tu URL real
curl https://TU-URL-RAILWAY.railway.app/

# Deberías ver algo como:
# {"message":"API funcionando correctamente","status":"OK"}
```

Si NO funciona:
- Ve a Railway → Logs → Revisa errores
- Verifica que las variables de entorno estén configuradas
- Haz redeploy si es necesario

### 3. **Actualizar variable de entorno en Vercel**
1. Ve a [Vercel](https://vercel.com)
2. Entra a tu proyecto
3. Ve a Settings → Environment Variables
4. Busca `REACT_APP_API_URL`
5. **Cambia el valor a tu URL real de Railway**:
   ```
   REACT_APP_API_URL=https://TU-URL-REAL.railway.app
   ```
6. **Importante**: NO pongas `/` al final

### 4. **Actualizar variable FRONTEND_URL en Railway**
1. Ve a Railway → Tu proyecto → Variables
2. Añade o actualiza `FRONTEND_URL` con tu URL de Vercel:
   ```
   FRONTEND_URL=https://tu-proyecto.vercel.app
   ```

### 5. **Redeploy ambos servicios**
1. **Railway**: Ve a Deployments → Deploy
2. **Vercel**: Ve a Deployments → Redeploy

### 6. **Probar la conexión**
Una vez que terminen los deployments:

```bash
# Probar registro en el backend con CORS
curl -i \
  -X POST https://TU-URL-RAILWAY.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: https://tu-proyecto.vercel.app" \
  -d '{"name":"Test","email":"test@test.com","password":"Test12345"}'

# Verifica:
# - HTTP/2 201 (o 200)
# - Access-Control-Allow-Origin: https://tu-proyecto.vercel.app

# Luego abre tu frontend en Vercel y prueba el registro en la UI
```

## 🚨 PROBLEMAS COMUNES

### Error: "CORS blocked"
- Verifica que `FRONTEND_URL` esté configurado en Railway
- Asegúrate de que la URL sea exactamente la de Vercel (sin `/` al final)

### Error: "Network Error" 
- Tu backend no está funcionando
- Revisa logs en Railway
- Verifica variables de entorno

### Error: "404 Not Found"
- La URL del backend está mal configurada
- Verifica `REACT_APP_API_URL` en Vercel

### Error: "500 Internal Server Error"
- Error en el código del backend
- Revisa logs en Railway
- Problema con MongoDB

## 📋 CHECKLIST RÁPIDO

- [ ] Backend funciona: `curl https://TU-URL.railway.app/`
- [ ] Variables en Railway:
  - [ ] `MONGO_URI` configurado
  - [ ] `JWT_SECRET` configurado  
  - [ ] `FRONTEND_URL` con URL de Vercel
- [ ] Variables en Vercel:
  - [ ] `REACT_APP_API_URL` con URL de Railway
- [ ] Ambos servicios redeployados
- [ ] Test de registro funciona

## 🔍 COMANDOS DE DEBUG

```bash
# 1. Probar backend
curl -v https://TU-URL.railway.app/

# 2. Probar registro con headers
curl -v -X POST https://TU-URL.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: https://tu-proyecto.vercel.app" \
  -d '{"name":"Test","email":"test@test.com","password":"Test12345"}'

# 3. Probar desde frontend (en consola del navegador)
fetch('https://TU-URL.railway.app/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({name:'Test',email:'test@test.com',password:'Test12345'})
}).then(r=>r.json()).then(console.log)
```

## 🆘 SI NADA FUNCIONA

1. **Comparte los logs**:
   - Logs de Railway (Deployments → Logs)
   - Logs de Vercel (Functions → Ver logs)
   - Console del navegador (F12 → Console)

2. **URLs exactas**:
   - URL de Railway
   - URL de Vercel
   - Variables de entorno configuradas

3. **Resetear todo**:
   - Borra y recrea el proyecto en Railway
   - Borra y recrea el proyecto en Vercel
   - Usa el `server-railway.js` optimizado
