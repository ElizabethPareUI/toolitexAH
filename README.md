# Plataforma B2B de Catálogos y Cotizaciones Textiles (MERN Stack)

## Descripción del Proyecto

Este es un proyecto full-stack desarrollado con el **stack MERN (MongoDB, Express, React, Node.js)** que simula una plataforma B2B (Business-to-Business) para la industria textil. La aplicación está diseñada para que empresas proveedoras de hilados y otros productos textiles puedan exhibir sus catálogos, y para que empresas distribuidoras puedan explorarlos y solicitar cotizaciones personalizadas de forma eficiente.

El proyecto fue creado como parte del parcial de la asignatura **Aplicaciones Híbridas**, con el objetivo de demostrar la construcción de una aplicación web moderna, segura y escalable desde cero.

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

*   **Backend (`/api`):**
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

## Cómo Ejecutar el Proyecto

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/ElizabethPareUI/toolitexAH.git
    cd toolitexAH
    ```

2.  **Configurar Backend:**
    *   Navegar a la carpeta `api`: `cd api`
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
