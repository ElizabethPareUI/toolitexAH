<<<<<<< HEAD
# 🧶 ToolitexAH - Plataforma B2B Textil

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://your-frontend-url.com)
[![Backend API](https://img.shields.io/badge/API-Backend-blue)](https://your-backend-url.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-Website-orange)](https://tu-portfolio.com)

## 🚀 Demo en Vivo

- **Frontend**: [https://your-frontend-url.com](https://your-frontend-url.com)
- **Backend API**: [https://your-backend-url.com](https://your-backend-url.com)

### 👤 Usuarios de prueba:
- **Admin**: admin@test.com / password123
- **Distribuidor**: user@test.com / password123

---

## 📋 Descripción del Proyecto

Plataforma B2B full-stack desarrollada con el **stack MERN (MongoDB, Express, React, Node.js)** para la industria textil. Permite a empresas proveedoras de hilados y productos textiles exhibir sus catálogos, y a empresas distribuidoras explorar productos y solicitar cotizaciones personalizadas.

**🎯 Preparado para Portfolio**: Este proyecto está completamente configurado para deployment en servidores gratuitos y listo para mostrar en tu portfolio profesional.

### 🌟 Características Destacadas

- 🔐 **Sistema de autenticación JWT completo**
- 🛒 **Sistema de cotizaciones B2B**
- 👥 **Portal especializado para proveedores**
- 📊 **Panel de administración avanzado**
- 🔍 **Sistema de filtros por categoría, precio y disponibilidad**
- 📱 **Diseño responsive para todos los dispositivos**
- 🎨 **Interfaz moderna con React + Bootstrap**
- 🌐 **API RESTful bien documentada**

## 🛠️ Tecnologías Utilizadas

### Frontend
- ⚛️ React 18 + Redux
- 🎨 React-Bootstrap + Sass
- 📡 Axios para peticiones HTTP
- 🔄 React Router para navegación

### Backend
- 🚀 Node.js + Express.js
- 🗄️ MongoDB + Mongoose
- 🔐 JWT + bcryptjs
- 📁 Multer para upload de archivos

### Deployment
- **Frontend**: Hosting gratuito (elige tu plataforma)
- **Backend**: Hosting gratuito (elige tu plataforma)
- **Database**: MongoDB Atlas (gratuito)
=======
# Plataforma B2B de Catálogos y Cotizaciones Textiles (MERN Stack)

## Descripción del Proyecto

Este es un proyecto full-stack desarrollado con el **stack MERN (MongoDB, Express, React, Node.js)** que simula una plataforma B2B (Business-to-Business) para la industria textil. La aplicación está diseñada para que empresas proveedoras de hilados y otros productos textiles puedan exhibir sus catálogos, y para que empresas distribuidoras puedan explorarlos y solicitar cotizaciones personalizadas de forma eficiente.

El proyecto fue creado como parte del parcial de la asignatura **Aplicaciones Híbridas**, con el objetivo de demostrar la construcción de una aplicación web moderna, segura y escalable desde cero.
>>>>>>> c04ea0f9f135a15b0dc411129c069b1268f7d435

## Estructura Unificada del Proyecto

**¡IMPORTANTE: El proyecto ha sido reorganizado para una mejor estructura!**

```
<<<<<<< HEAD
toolitexAH/
├── backend/                 # API y servidor backend
=======
proyecto/
├── backend/                 # API y servidor backend (anteriormente 'api/')
>>>>>>> c04ea0f9f135a15b0dc411129c069b1268f7d435
│   ├── controllers/        # Controladores de rutas
│   ├── data/              # Datos de prueba y seeds
│   ├── middlewares/       # Middlewares personalizados
│   ├── models/            # Modelos de MongoDB/Mongoose
│   ├── routes/            # Definición de rutas
│   ├── uploads/           # Archivos subidos
│   ├── seeder.js          # Script para poblar la BD
│   ├── server.js          # Entrada principal del servidor
│   └── package.json       # Dependencias del backend
├── frontend/              # Aplicación React
│   ├── public/           # Archivos públicos
│   ├── src/              # Código fuente
│   └── package.json      # Dependencias del frontend
└── package.json          # Scripts principales del proyecto
```

<<<<<<< HEAD
## 🚀 Deployment

### ✅ Configuración Completa para Deployment
Este proyecto está listo para ser desplegado en cualquier plataforma de hosting gratuita.

### 📄 Guía de Deployment
Para desplegar el proyecto:
1. Configurar MongoDB Atlas
2. Desplegar el backend en tu plataforma elegida
3. Desplegar el frontend en tu plataforma elegida
4. Configurar variables de entorno
5. Verificar el funcionamiento

=======
>>>>>>> c04ea0f9f135a15b0dc411129c069b1268f7d435
## Características Principales

*   **Arquitectura Desacoplada:** El backend es una **API RESTful** autónoma construida con Node.js y Express, mientras que el frontend es una **Single Page Application (SPA)** dinámica creada con React.
*   **Autenticación y Autorización con JWT:** Sistema completo de registro y login de usuarios. La seguridad de las rutas y el acceso a los datos se gestiona mediante **JSON Web Tokens (JWT)**, garantizando que solo los usuarios autenticados puedan realizar acciones críticas.
*   **Lógica de Negocio B2B:**
    *   **Portal de Proveedores:** Un portal protegido donde los distribuidores pueden ingresar un código para acceder a los catálogos exclusivos de diferentes proveedores.
    *   **Catálogos Personalizados:** Cada proveedor tiene su propia página de catálogo con su branding y listado de productos.
*   **Sistema de Solicitud de Cotizaciones:** En lugar de un carrito de compras tradicional, los usuarios (distribuidores) añaden productos a un "carrito de cotización". Al finalizar, se genera una solicitud formal que simula ser enviada al proveedor.
*   **Panel de Control del Distribuidor:** Un dashboard personal para que los usuarios puedan llevar un registro de los catálogos de proveedores que han visitado y acceder a ellos rápidamente.
*   **Gestión de Estado Centralizada:** Se utiliza **Redux** con Redux Thunk para manejar de forma eficiente el estado global de la aplicación, incluyendo la sesión del usuario, los productos y el carrito de cotizaciones.
*   **Diseño Responsivo:** Interfaz de usuario limpia y adaptable a diferentes tamaños de pantalla, desarrollada con React-Bootstrap y SASS.

## Funcionalidades Principales

### Sistema de Filtros Avanzados

La plataforma incluye un sistema completo de filtros para mejorar la experiencia de navegación tanto para administradores como para distribuidores:

*   **Filtros Disponibles:**
    *   **Búsqueda por texto:** Buscar productos por nombre o descripción
    *   **Filtro por categoría:** Lanas, Hilos, Accesorios
    *   **Filtro por rango de precios:** Precio mínimo y máximo
    *   **Filtro por stock:** Solo productos disponibles
    *   **Ordenamiento:** Por fecha, nombre, precio, rating

*   **Ubicación de Filtros:**
    *   **Dashboard de Admin de Panky:** Gestión completa de productos con filtros
    *   **Catálogo Público de Panky Hilados:** Filtros para distribuidores con códigos de acceso
    *   **Indicadores visuales:** Badges que muestran filtros activos y cantidad de productos encontrados

### Gestión de Productos para Admin de Panky

*   **Crear productos:** Formulario completo con subida de imágenes
*   **Editar productos:** Modificación en tiempo real con persistencia en base de datos
*   **Eliminar productos:** Solo productos propios de la marca Panky
*   **Validaciones:** Precios mínimos, stock, categorías válidas

### Portal de Distribuidores

*   **Acceso con códigos:** Sistema seguro de acceso a catálogos exclusivos
*   **Solicitud de cotizaciones:** Carrito de cotización en lugar de compras directas
*   **Filtros dinámicos:** Misma funcionalidad de filtros que el dashboard de admin
*   **Interfaz optimizada:** Diseño específico para distribuidores B2B

## Stack Tecnológico

*   **Backend (`/backend`):**
    *   **Framework:** Node.js, Express
    *   **Base de Datos:** MongoDB (con Mongoose como ODM)
    *   **Autenticación:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` para el hasheo de contraseñas.
    *   **Middleware:** `cors`, `dotenv`.

*   **Frontend (`/frontend`):**
    *   **Librería:** React.js (con Componentes Funcionales y Hooks)
    *   **Enrutamiento:** React Router (`react-router-dom`)
    *   **Gestión de Estado:** Redux (`react-redux`, `redux-thunk`)
    *   **Peticiones HTTP:** Axios
    *   **UI/Estilos:** React-Bootstrap, SASS (`node-sass`)

## Instalación y Ejecución

### Instalación Rápida (Recomendada)

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/ElizabethPareUI/toolitexAH.git
    cd toolitexAH
    ```

2.  **Instalar todas las dependencias:**
    ```bash
    npm run install-deps
    ```

3.  **Configurar variables de entorno:**
    - Crear archivo `.env` en `/backend/` con:
    ```
    MONGO_URI=tu_uri_de_mongodb
    JWT_SECRET=tu_jwt_secret
    NODE_ENV=development
    ```

4.  **Poblar la base de datos:**
    ```bash
    cd backend
    npm run data:import
    ```

5.  **Ejecutar todo el proyecto:**
    ```bash
    npm run dev
    ```
    Esto iniciará tanto el backend (puerto 5000) como el frontend (puerto 3000) simultáneamente.

### Scripts Disponibles

#### En el directorio raíz:
- `npm run dev` - Ejecuta backend y frontend simultáneamente
- `npm run server` - Solo el backend
- `npm run client` - Solo el frontend
- `npm run install-deps` - Instala dependencias en todos los directorios

#### En el directorio backend:
- `npm run data:import` - Poblar base de datos con datos de prueba
- `npm run data:destroy` - Limpiar base de datos

### Configuración Manual (Alternativa)

2.  **Configurar Backend:**
    *   Navegar a la carpeta `backend`: `cd backend`
    *   Instalar dependencias: `npm install`
    *   Crear un archivo `.env` en la raíz de `/api` y añadir las siguientes variables:
        ```
        NODE_ENV=development
        PORT=5000
        MONGO_URI=tu_string_de_conexion_a_mongodb
        JWT_SECRET=tu_secreto_para_jwt
        ```
    *   (Opcional) Importar datos de prueba: `npm run data:import`
    *   Iniciar el servidor backend: `npm run server`

3.  **Configurar Frontend:**
    *   Navegar a la carpeta `frontend` (desde la raíz): `cd ../frontend`
    *   Instalar dependencias: `npm install`
    *   Iniciar la aplicación React: `npm start`

La aplicación frontend estará disponible en `http://localhost:3000` y se conectará a la API que corre en `http://localhost:5000`.

## Credenciales de Acceso y Proveedores

Para facilitar las pruebas y la demostración de la plataforma, se han preconfigurado los siguientes usuarios y códigos de proveedor:

### Usuarios de Prueba

*   **Administrador de Panky Hilados:**
    *   **Email:** `adminpanky@test.com`
    *   **Contraseña:** `PankyPassword123!`
    *   **Rol:** Este usuario puede gestionar (crear, editar, eliminar) únicamente los productos de la marca "Panky".

*   **Usuario Distribuidor (Ejemplo):**
    *   **Email:** `juan@ejemplo.com`
    *   **Contraseña:** `password`
    *   **Rol:** Puede ver los catálogos de los proveedores y solicitar cotizaciones.

### Códigos de Proveedor

Para acceder a los catálogos exclusivos desde el portal de proveedores, utiliza los siguientes códigos:

*   **Panky Hilados:** `456PANKY`
*   **Mia Hilados:** `123MIA`
