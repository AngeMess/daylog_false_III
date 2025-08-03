# Documentación de la Carpeta Global

## Descripción General
La carpeta "Global" contiene todos los componentes necesarios para la visualización y representación del dashboard global de la aplicación DayLog. Esta sección ofrece una visión general de las estadísticas y datos relevantes a nivel internacional, centrándose en los países de Centroamérica (El Salvador, Guatemala y Honduras).

## Componentes

### 1. `index.jsx`
**Propósito**: Componente principal que estructura el dashboard global y organiza todos los subcomponentes.

**Características**:
- Divide la interfaz en secciones lógicas: globo terrestre, tarjetas de estadísticas, y visualizaciones de datos.
- Gestiona datos simulados para todas las estadísticas mostradas.
- Implementa una disposición responsive que se adapta a diferentes tamaños de pantalla.
- Utiliza animaciones de entrada para mejorar la experiencia de usuario.

**Dependencias**:
- Framer Motion para animaciones
- Lucide React para iconos
- Componentes personalizados de visualización

### 2. `Globe.jsx`
**Propósito**: Muestra un globo terráqueo interactivo en 3D centrado en Centroamérica con marcadores para los países relevantes.

**Características**:
- Utiliza la biblioteca "cobe" para renderizar un globo 3D interactivo.
- Implementa interacción mediante arrastre (drag) para rotación manual.
- Animación automática de rotación cuando no hay interacción del usuario.
- Marcadores visuales para El Salvador, Guatemala y Honduras.
- Optimización de rendimiento mediante referencias (useRef) para valores persistentes.

**Documentación Técnica**:
- `phiRef`: Referencia para mantener el ángulo de rotación phi.
- `widthRef`: Referencia para mantener el ancho del componente.
- `updatePointerInteraction()`: Gestiona el estado de interacción del puntero.
- `updateMovement()`: Actualiza la rotación del globo basada en el movimiento del puntero.

### 3. `AdvancedChart.jsx`
**Propósito**: Visualización avanzada de datos mediante gráficos interactivos con múltiples opciones de visualización.

**Características**:
- Implementa múltiples tipos de gráficos: barras, líneas, circular, anillo y polar.
- Controles interactivos para cambiar entre tipos de visualización.
- Opciones para mostrar/ocultar leyenda y cuadrícula.
- Modo de comparación para "Actividades por hacer vs. Actividades realizadas".
- Sección detallada de eficiencia general con desglose por país.

**Documentación Técnica**:
- `chartType`: Estado para el tipo de gráfico seleccionado.
- `showLegend`: Controla la visibilidad de la leyenda.
- `showGridLines`: Controla la visibilidad de las líneas de cuadrícula.
- `viewMode`: Alterna entre modos de visualización (comparación/distribución).
- `getChartOptions()`: Genera opciones de configuración del gráfico según el tipo seleccionado.
- `renderChart()`: Renderiza el tipo de gráfico apropiado basado en el estado actual.

### 4. `StatCard.jsx`
**Propósito**: Tarjeta reutilizable para mostrar estadísticas individuales con un ícono y valor.

**Características**:
- Diseño minimalista y claro con animación de entrada.
- Soporte para diferentes tipos de iconos.
- Estructura consistente para todas las estadísticas mostradas.

**Props**:
- `title`: Título de la estadística.
- `value`: Valor numérico o textual a mostrar.
- `icon`: Componente de icono de Lucide React.

### 5. `HighlightAreaCard.jsx`
**Propósito**: Muestra un área destacada o categoría importante.

**Características**:
- Resalta visualmente un área o categoría específica.
- Diseño destacado para llamar la atención sobre información crítica.

**Props**:
- `area`: Texto que describe el área destacada.

### 6. `RatingsCard.jsx`
**Propósito**: Visualiza porcentajes de valoraciones y satisfacción.

**Características**:
- Visualización clara de porcentajes con elementos gráficos.
- Diseño que permite una rápida comprensión de la información.

**Props**:
- `percentage`: Porcentaje de valoraciones positivas.

### 7. `EmployeeActivityCard.jsx`
**Propósito**: Muestra información sobre empleados destacados, ya sea por alto o bajo rendimiento.

**Características**:
- Distingue visualmente entre empleados de alto y bajo rendimiento.
- Estructura clara que enfatiza el nombre del empleado y su categoría.

**Props**:
- `title`: Título descriptivo (ej. "Empleado con más actividades").
- `name`: Nombre del empleado.
- `isPositive`: Booleano que indica si es una métrica positiva o negativa.

## Integración y Uso

El dashboard Global se integra en la aplicación principal a través de la ruta `/admin/global`. Todos los componentes están diseñados para trabajar juntos y proporcionar una experiencia unificada.

Para personalizar los datos, se pueden modificar los objetos de datos simulados en `index.jsx` y `AdvancedChart.jsx`, que eventualmente deberían conectarse a una API real para obtener datos dinámicos.

## Consideraciones de Rendimiento

- El componente `Globe.jsx` puede ser intensivo en recursos. Las optimizaciones actuales incluyen:
  - Uso de referencias (useRef) para evitar re-renderizados innecesarios.
  - Control de la calidad del renderizado a través de las opciones de configuración.
- Los gráficos en `AdvancedChart.jsx` se montan condicionalmente para evitar problemas de hidratación en SSR.

## Personalización

La mayoría de los componentes aceptan props para personalización. Los colores y estilos principales se basan en la paleta de DayLog, con azul (#01426A) como color primario y amarillo (#FFC600) como color de acento.
