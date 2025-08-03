import { useState, useEffect } from 'react';

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsuarios: 0,
    proyectosActivos: 0,
    supervisores: [],
    proximosProyectos: [],
    loading: true,
    error: null
  });

  // Función para probar un endpoint individual con mejor manejo de errores
  const testEndpoint = async (url, name) => {
    try {
      console.log(`🔄 Probando endpoint: ${name} - ${url}`);
      
      // Agregar timestamp para evitar caché sin usar headers adicionales
      const urlWithTimestamp = `${url}?_t=${Date.now()}`;
      
      const response = await fetch(urlWithTimestamp, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Agregar headers de autenticación si es necesario
          // 'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`📊 Respuesta de ${name}:`, {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Manejar códigos de estado específicos
      if (response.status === 304) {
        // 304 Not Modified - el contenido no ha cambiado, usar datos cacheados
        console.log(`📦 ${name}: Datos no modificados (304), usando caché`);
        // Intentar obtener datos del caché o usar datos por defecto
        return { data: null, cached: true };
      }
      
      if (!response.ok) {
        let errorText;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorText = JSON.stringify(errorData, null, 2);
          } catch (e) {
            errorText = await response.text();
          }
        } else {
          errorText = await response.text();
        }
        
        console.error(`❌ Error detallado en ${name}:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: url
        });
        
        return { 
          error: `Error ${response.status}: ${response.statusText}`,
          details: errorText,
          status: response.status
        };
      }

      const data = await response.json();
      console.log(`✅ Datos de ${name}:`, data);
      return { data };

    } catch (error) {
      console.error(`❌ Excepción en ${name}:`, {
        message: error.message,
        stack: error.stack,
        url: url
      });
      return { error: error.message };
    }
  };

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      console.log('🔄 Iniciando pruebas individuales de endpoints...');

      // Probar cada endpoint por separado con mejor debugging
      console.log('🔄 PROBANDO USUARIOS...');
      const usuariosResult = await testEndpoint('http://localhost:3000/api/employee/active-sessions-count', 'Usuarios');
      console.log('📊 Resultado Usuarios:', usuariosResult);

      console.log('🔄 PROBANDO PROYECTOS...');
      const proyectosResult = await testEndpoint('http://localhost:3000/api/proyect/stats/dashboard', 'Proyectos');
      console.log('📊 Resultado Proyectos:', proyectosResult);

      console.log('🔄 PROBANDO SUPERVISORES...');
      const supervisoresResult = await testEndpoint('http://localhost:3000/api/proyect/stats/supervisors', 'Supervisores');
      console.log('📊 Resultado Supervisores:', supervisoresResult);

      // Recopilar todos los errores
      const errors = [];
      const cachedResponses = [];
      
      if (usuariosResult.error) {
        errors.push(`Usuarios: ${usuariosResult.error}`);
      }
      if (usuariosResult.cached) {
        cachedResponses.push('Usuarios');
      }
      
      if (proyectosResult.error) {
        errors.push(`Proyectos: ${proyectosResult.error} (Status: ${proyectosResult.status})`);
      }
      if (proyectosResult.cached) {
        cachedResponses.push('Proyectos');
      }
      
      if (supervisoresResult.error) {
        errors.push(`Supervisores: ${supervisoresResult.error} (Status: ${supervisoresResult.status})`);
      }
      if (supervisoresResult.cached) {
        cachedResponses.push('Supervisores');
      }

      // Mostrar información sobre respuestas cacheadas
      if (cachedResponses.length > 0) {
        console.log(`📦 Respuestas cacheadas (304): ${cachedResponses.join(', ')}`);
      }

      // Si hay errores, mostrar información detallada pero continuar con datos parciales
      if (errors.length > 0) {
        console.warn('⚠️ Algunos endpoints fallaron:', errors);
      }

      // Usar datos disponibles, incluso si algunos endpoints fallaron
      const usuariosData = usuariosResult.data || {};
      const proyectosData = proyectosResult.data || {};
      const supervisoresData = supervisoresResult.data || {};

      console.log('📈 Procesando datos disponibles...');

      // Formatear datos con validaciones seguras
      const supervisoresFormatted = (supervisoresData?.supervisors || []).slice(0, 3).map(supervisor => ({
        name: supervisor?.name || 'Sin nombre',
        description: `${supervisor?.role || 'Supervisor'}, ${supervisor?.totalProjects || 0} proyectos totales`,
        value: `${supervisor?.totalProjects || 0} proyectos`,
        activeProjects: supervisor?.activeProjects || 0,
        completedProjects: supervisor?.completedProjects || 0
      }));

      const proximosProyectosFormatted = (proyectosData?.upcomingProjects || []).slice(0, 3).map(proyecto => ({
        name: proyecto?.name || 'Sin nombre',
        description: `Supervisor: ${proyecto?.supervisor || 'No asignado'}`,
        value: proyecto?.startDate ? formatDate(proyecto.startDate) : 'Fecha no definida',
        daysUntilStart: proyecto?.daysUntilStart || 0,
        supervisor: proyecto?.supervisor || 'No asignado',
        state: proyecto?.state || 'Sin estado'
      }));

      setDashboardData({
        totalUsuarios: usuariosData?.count || 0,
        proyectosActivos: proyectosData?.projectsByState?.activos || 0,
        supervisores: supervisoresFormatted,
        proximosProyectos: proximosProyectosFormatted,
        loading: false,
        error: errors.length > 0 ? `Errores en endpoints: ${errors.join(', ')}` : null
      });

      if (errors.length === 0) {
        console.log('✅ Dashboard data actualizado exitosamente');
      } else {
        console.warn('⚠️ Dashboard actualizado con errores parciales');
      }

    } catch (error) {
      console.error('❌ Error general fetching dashboard data:', error);
      
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar los datos del dashboard'
      }));
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Fecha inválida recibida:', dateString);
        return 'Fecha inválida';
      }

      const day = date.getDate();
      const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];
      const month = monthNames[date.getMonth()];
      return `${day} ${month}`;
    } catch (error) {
      console.error('❌ Error formateando fecha:', error);
      return 'Error en fecha';
    }
  };

  const refreshData = () => {
    console.log('🔄 Refrescando datos del dashboard...');
    fetchDashboardData();
  };

  useEffect(() => {
    console.log('🚀 Inicializando hook useDashboardData');
    fetchDashboardData();
  }, []);

  return {
    ...dashboardData,
    refreshData
  };
};

export default useDashboardData;