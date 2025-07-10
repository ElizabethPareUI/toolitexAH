# 🔧 SOLUCIÓN ERROR 405 EN RAILWAY

## ❌ PROBLEMA IDENTIFICADO
El error 405 en Railway se debe a que el servidor no está iniciando correctamente o las rutas no están funcionando. 

## ✅ SOLUCIÓN PASO A PASO

### 1. **Subir el código corregido a GitHub**
```bash
git add .
git commit -m "Fix Railway deployment - server optimizado"
git push origin main
```

### 2. **Verificar configuración en Railway**
Ve a tu proyecto en Railway y verifica:

#### Variables de entorno OBLIGATORIAS:
- `MONGO_URI`: `mongodb+srv://mariapare:TOOLITEX25@cluster0.q8wcdkq.mongodb.net/Cluster0`
- `JWT_SECRET`: `eliyestefi`
- `PORT`: `3001` (opcional, Railway lo asigna automáticamente)
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Tu URL de Vercel (ej: `https://toolitex.vercel.app`)

#### Configuración del servicio:
- **Root Directory**: `backend`
- **Build Command**: (vacío - Docker se encarga)
- **Start Command**: (vacío - Docker se encarga)

### 3. **Forzar redeploy en Railway**
1. Ve a la pestaña "Deployments"
2. Haz clic en "Deploy" o "Redeploy"
3. Espera a que termine (2-3 minutos)

### 4. **Verificar que funciona**
Una vez que termine el deployment:

#### Probar la URL raíz:
```bash
curl https://TU-URL-RAILWAY.app/
```
Deberías ver: `{"message":"API funcionando correctamente","status":"OK"}`

#### Probar el registro:
```bash
curl -X POST https://TU-URL-RAILWAY.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"TestPass123"}'
```

### 5. **Actualizar frontend en Vercel**
Si el backend ya funciona, actualiza la variable en Vercel:
- `REACT_APP_API_URL`: `https://TU-URL-RAILWAY.app`

### 6. **Logs para debug**
Si sigue fallando, revisa los logs en Railway:
1. Ve a tu proyecto
2. Pestaña "Deployments" 
3. Clic en el último deployment
4. Revisa "Build Logs" y "Deploy Logs"

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Error: "Cannot find module"
- Revisa que `package.json` tenga todas las dependencias
- Verifica que Docker esté usando `npm install` correctamente

### Error: "MongoDB connection failed"
- Verifica que `MONGO_URI` esté correctamente configurado
- Asegúrate de que la base de datos permita conexiones desde cualquier IP

### Error: "Port already in use"
- Railway asigna el puerto automáticamente
- No hardcodees el puerto en el código

### Error CORS
- Verifica que `FRONTEND_URL` esté configurado
- El servidor ya tiene CORS configurado para Vercel

## 📝 CHECKLIST FINAL
- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas en Railway
- [ ] Deployment completado sin errores
- [ ] URL raíz responde correctamente
- [ ] Endpoint de registro funciona
- [ ] Frontend actualizado con la URL correcta

## 🆘 SI NADA FUNCIONA
1. **Borra el proyecto de Railway** y créalo de nuevo
2. **Usa el server-railway.js** que es más estable
3. **Verifica MongoDB Atlas** - debe permitir conexiones desde 0.0.0.0/0
4. **Contacta soporte de Railway** si persiste el problema
