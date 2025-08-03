<div align="center">

# 📝 DayLog

**Sistema de Gestión de Tareas y Monitoreo de Productividad**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-Latest-lightgrey.svg)](https://expressjs.com/)

</div>  

## 📋 Tabla de Contenidos

- [📖 Acerca del Proyecto](#-acerca-del-proyecto)
- [🛠️ Tecnologías](#️-tecnologías)
- [👥 Equipo](#-equipo)
- [🚀 Instalación y Uso](#-instalación-y-uso)
- [📊 Características Principales](#-características-principales)
- [🧰 Comandos Útiles](#-comandos-útiles)
- [🔄 Flujo de Trabajo](#-flujo-de-trabajo)
- [📦 Dependencias](#-dependencias)
- [📝 Notas Importantes](#-notas-importantes)

## 📖 Acerca del Proyecto

DayLog es una aplicación web y móvil diseñada para optimizar la gestión y administración de tareas en entornos empresariales. La plataforma ofrece:

- **Gestión intuitiva de tareas** para empleados y equipos
- **Asignación y seguimiento de proyectos** en tiempo real
- **Análisis de rendimiento** mediante gráficos interactivos
- **Monitoreo de carga laboral** para prevenir la saturación de equipos
- **Administración eficiente de recursos humanos**

La aplicación proporciona una interfaz intuitiva para el registro diario de actividades, facilitando tanto la gestión operativa como la toma de decisiones estratégicas basadas en datos.

### Nomenclaturas del proyecto

- PascalCase: Usada para constantes, nombres de pages y screens y en general para la mayoria en la app.
- camelCase: Usada para los nombres de los Hooks.
- Kebab-case: Usada para las APIs
  
## 🛠️ Tecnologías

### Stack Principal (MERN)

- **M**ongoDB: Base de datos NoSQL para almacenamiento flexible de datos
- **E**xpress: Framework backend para APIs robustas y escalables
- **R**eact: Biblioteca frontend para interfaces de usuario dinámicas
- **N**ode.js: Entorno de ejecución para el backend

### Frontend

- React 19
- Vite 6
- TailwindCSS 4
- React Router 7
- Framer Motion
- GSAP
- React Responsive

### Backend

- Node.js 18+
- Express
- MongoDB (Mongoose)
- Redis (Caché)
- Winston (Logging)
- Compression (Optimización HTTP)

### DevOps y Herramientas

- Turborepo (Monorepo)
- GitHub Actions (CI/CD)
- ESLint & Prettier

## 👥 Equipo

| Nombre | Código | Rol |
|--------|--------|-----|
| Angel Mauricio Chévez Campos | 20230252 | Fullstack Developer |
| Aarón Edgardo García Romero | 20230406 | Frontend Developer |
| Ethan David Henríquez Díaz | 20230006 | Backend Developer |
| Christian Alessandro Marín Sandoval | 20200237 | DevOps Engineer |
| Sofía Verónica Palacios Lara | 20230106 | UX/UI Designer |

## 🚀 Instalación y Uso

Para instalar y ejecutar el proyecto DayLog, sigue estos pasos:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/chaichor/DayLog.git
   cd DayLog
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   - Crea archivos `.env` en las carpetas `apps/Backend` y `apps/web` según los ejemplos proporcionados

4. **Iniciar en modo desarrollo**:
   ```bash
   npm run dev
   ```

5. **Acceder a las aplicaciones**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)

## 📊 Características Principales

- Gestión de tareas y proyectos
- Análisis de rendimiento y monitoreo de carga laboral
- Administración de recursos humanos
- Interfaz intuitiva y personalizable

## 🧰 Comandos Útiles

### 🚀 Desarrollo

```bash
# Iniciar todo el entorno de desarrollo
npm run dev

# Iniciar solo el backend
cd apps/Backend
npm run dev

# Iniciar solo el frontend
cd apps/web
npm run dev
```

### 🏗️ Construcción

```bash
# Construir todo el proyecto
npm run build

# Construir solo el backend
cd apps/Backend
npm run build

# Construir solo el frontend
cd apps/web
npm run build
```

### 🧹 Mantenimiento

```bash
# Limpiar caché de Turbo
npx turbo clean

# Limpiar node_modules (Windows)
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "**/node_modules" -Recurse -Force
```

### 📊 Monitoreo

```bash
# Ver logs del backend
npm run logs:backend

# Ver logs del frontend
npm run logs:frontend
```

### 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm test -- --coverage
```

## 🔄 Flujo de Trabajo Recomendado

1. **Actualizar el repositorio**:
   ```bash
   git pull origin main
   ```

2. **Crear una nueva rama de trabajo**:
   ```bash
   git checkout -b feature/nombre-caracteristica
   ```

3. **Iniciar el entorno de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Antes de hacer commit**:
   ```bash
   npm run build
   npm test
   ```

5. **Si hay problemas con dependencias**:
   ```bash
   npm cache clean --force
   Remove-Item -Path "node_modules" -Recurse -Force
   npm install
   ```

6. **Realizar commits con mensajes descriptivos**:
   ```bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   ```

7. **Subir cambios y crear Pull Request**:
   ```bash
   git push origin feature/nombre-caracteristica
   ```

## 📦 Dependencias Principales

### Frontend (apps/web)

- `react@19.1.0`: Biblioteca para construir interfaces de usuario
- `react-dom@19.1.0`: Renderización de componentes React en el navegador
- `react-router-dom@7.5.0`: Enrutamiento para aplicaciones React
- `vite@6.2.4`: Herramienta de construcción rápida para desarrollo web
- `tailwindcss@4.1.3`: Framework CSS utilitario para diseño rápido
- `framer-motion@12.6.3`: Biblioteca de animaciones para React
- `gsap@3.12.7`: Biblioteca de animaciones profesionales
- `react-responsive`: Componentes responsivos para diferentes dispositivos

### Backend (apps/Backend)

- `express`: Framework web minimalista para Node.js
- `mongoose`: ODM para MongoDB
- `winston`: Logger versatil para Node.js
- `compression`: Middleware para compresión HTTP
- `helmet`: Middleware para seguridad HTTP
- `node-cache`: Sistema de caché en memoria para respuestas HTTP
- `cors`: Middleware para habilitar CORS
- `jsonwebtoken`: Implementación de JWT para autenticación

### DevOps y Herramientas

- `turborepo`: Sistema de monorepo para gestión de proyectos JavaScript
- `eslint@9.23.0`: Herramienta de linting para JavaScript
- `prettier`: Formateador de código

## 📝 Notas Importantes

- **Requisitos del sistema**:
  - Node.js 18+ instalado
  - MongoDB ejecutándose localmente o en la nube

- **Optimizaciones implementadas**:
  - Compresión HTTP para reducir tamaño de respuestas
  - Sistema de caché para respuestas frecuentes
  - Logging detallado para monitoreo y depuración
  - Middleware de seguridad con helmet

- **URLs de desarrollo**:
  - Frontend: [http://localhost:5173](http://localhost:5173)
  - Backend API: [http://localhost:3000](http://localhost:3000)

- **Estructura del proyecto**:
  - `/apps/web`: Aplicación frontend (React)
  - `/apps/Backend`: Servidor backend (Express)
  - `/packages`: Paquetes compartidos (logger, cache)
  - `/docs`: Documentación adicional

- **Variables de entorno**:
  - `NODE_ENV`: Entorno de ejecución (development, production)
  - `PORT`: Puerto para el servidor backend
  - `MONGODB_URI`: URI de conexión a MongoDB
  - `LOG_LEVEL`: Nivel de detalle para logs (debug, info, warn, error)
