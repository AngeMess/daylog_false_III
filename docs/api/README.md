# Documentación de la API de DayLog

## Introducción

La API de DayLog proporciona acceso a todas las funcionalidades del sistema a través de endpoints RESTful. Esta documentación describe los endpoints disponibles, los métodos de autenticación y los formatos de respuesta.

## Base URL

La API está disponible en:

- **Desarrollo**: `http://localhost:3000/api`
- **Producción**: `https://api.daylog.com/api` (ejemplo)

## Autenticación

La API utiliza autenticación basada en JWT (JSON Web Tokens). Los tokens deben incluirse en las cabeceras HTTP de la siguiente manera:

```
Authorization: Bearer <token>
```

Para obtener un token, utiliza el endpoint de login:

```
POST /api/login
```

## Endpoints principales

### Empleados

- `GET /api/employee` - Listar todos los empleados
- `GET /api/employee/:id` - Obtener detalles de un empleado
- `POST /api/employee` - Crear un nuevo empleado
- `PUT /api/employee/:id` - Actualizar un empleado
- `DELETE /api/employee/:id` - Eliminar un empleado

### Proyectos

- `GET /api/proyect` - Listar todos los proyectos
- `GET /api/proyect/:id` - Obtener detalles de un proyecto
- `POST /api/proyect` - Crear un nuevo proyecto
- `PUT /api/proyect/:id` - Actualizar un proyecto
- `DELETE /api/proyect/:id` - Eliminar un proyecto

### Actividades

- `GET /api/activity` - Listar todas las actividades
- `GET /api/activity/:id` - Obtener detalles de una actividad
- `POST /api/activity` - Crear una nueva actividad
- `PUT /api/activity/:id` - Actualizar una actividad
- `DELETE /api/activity/:id` - Eliminar una actividad

### Autenticación y gestión de usuarios

- `POST /api/login` - Iniciar sesión y obtener token
- `POST /api/logout` - Cerrar sesión
- `POST /api/passwordRecovery` - Solicitar restablecimiento de contraseña
- `POST /api/registerEmployee` - Registrar un nuevo empleado

## Formatos de respuesta

Todas las respuestas se devuelven en formato JSON con la siguiente estructura:

### Respuesta exitosa
```json
{
  "success": true,
  "data": { ... }
}
```

### Respuesta de error
```json
{
  "success": false,
  "error": "CÓDIGO_ERROR",
  "message": "Descripción del error"
}
```

## Optimizaciones implementadas

- **Compresión HTTP**: Todas las respuestas se comprimen para mejorar el rendimiento
- **Caché**: Los endpoints GET implementan caché para mejorar los tiempos de respuesta
- **Logs**: Todas las solicitudes se registran para facilitar la depuración

## Ejemplos de uso

Para ver ejemplos detallados de cómo utilizar cada endpoint, consulta la documentación específica en los archivos correspondientes de esta carpeta.
