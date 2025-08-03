/**
 * Servicio para proporcionar datos a la IA
 * Este servicio extrae y prepara datos de MongoDB para ser utilizados por el asistente IA
 */

// En esta fase de desarrollo usamos datos simulados en lugar de modelos reales
// cuando se integre con la base de datos real, importar los modelos aquí
// import Project from '../models/Project.js';
// import Employee from '../models/Employee.js';

/**
 * Analiza la consulta del usuario para determinar qué tipo de datos necesita
 */
function analyzeQuery(query) {
  query = query.toLowerCase();
  
  const dataTypes = [];
  
  if (query.includes('proyecto') || query.includes('proyectos')) {
    dataTypes.push('projects');
  }
  
  if (query.includes('empleado') || query.includes('empleados')) {
    dataTypes.push('employees');
  }
  
  if (query.includes('retraso') || query.includes('retrasado')) {
    dataTypes.push('delayedProjects');
  }
  
  if (query.includes('activ') || query.includes('mes') || query.includes('mensual')) {
    dataTypes.push('monthlyData');
  }
  
  // Si no se detectó ningún tipo específico, devolver datos generales
  if (dataTypes.length === 0) {
    dataTypes.push('general');
  }
  
  return dataTypes;
}

/**
 * Obtiene datos relevantes basados en el tipo de consulta
 * En esta implementación de desarrollo, siempre devuelve datos simulados
 */
async function getRelevantData(dataTypes) {
  const result = {};
  
  try {
    // En una implementación real, aquí se consultaría a MongoDB
    // Pero por ahora, siempre usamos datos simulados
    
    // Proyectos activos (simulados)
    if (dataTypes.includes('projects') || dataTypes.includes('general')) {
      // Simulamos proyectos en lugar de consultar la base de datos
      result.projects = [];
      // Los datos reales se añadirán más adelante en este método
    }
    
    // Proyectos retrasados (simulados)
    if (dataTypes.includes('delayedProjects')) {
      // Simulamos proyectos retrasados
      result.delayedProjects = [];
      // Los datos reales se añadirán más adelante en este método
    }
    
    // Empleados (simulados)
    if (dataTypes.includes('employees')) {
      // Simulamos empleados
      result.employees = [];
      // Los datos reales se añadirán más adelante en este método
    }
    
    // Si no hay datos reales, usar datos de ejemplo para desarrollo local
    if (Object.keys(result).length === 0 || !result.projects || result.projects.length === 0) {
      result.mockData = true;
      // Datos de proyectos más detallados
      result.projects = [
        { 
          name: 'Sistema de Gestión Comercial', 
          status: 'active', 
          startDate: '2025-01-15', 
          endDate: '2025-06-30', 
          employees: 5,
          completion: 65,
          budget: 85000,
          country: 'España',
          teamType: 'Desarrollo Web',
          description: 'Sistema para gestión de ventas y clientes con módulos de facturación y reportes'
        },
        { 
          name: 'Aplicación Móvil Corporativa', 
          status: 'active', 
          startDate: '2025-02-20', 
          endDate: '2025-08-15', 
          employees: 3,
          completion: 32,
          budget: 65000,
          country: 'México',
          teamType: 'Desarrollo Móvil',
          description: 'App corporativa con funcionalidades de gestión de tareas y comunicación interna'
        },
        { 
          name: 'Portal de Atención al Cliente', 
          status: 'delayed', 
          startDate: '2024-11-10', 
          endDate: '2025-04-15', 
          employees: 8,
          completion: 45,
          budget: 120000,
          country: 'Colombia',
          teamType: 'Desarrollo Web',
          delayReason: 'Cambios en los requisitos del cliente',
          description: 'Portal web para gestión de tickets de soporte y atención al cliente'
        },
        { 
          name: 'Sistema de Business Intelligence', 
          status: 'active', 
          startDate: '2025-03-05', 
          endDate: '2025-09-20', 
          employees: 6,
          completion: 28,
          budget: 95000,
          country: 'España',
          teamType: 'Análisis de Datos',
          description: 'Sistema de análisis de datos y generación de dashboards para toma de decisiones'
        },
        { 
          name: 'Rediseño Intranet Corporativa', 
          status: 'delayed', 
          startDate: '2024-12-01', 
          endDate: '2025-03-15', 
          employees: 4,
          completion: 68,
          budget: 55000,
          country: 'Argentina',
          teamType: 'UX/UI',
          delayReason: 'Escasez de recursos de diseño',
          description: 'Rediseño completo de la intranet corporativa con enfoque en experiencia de usuario'
        }
      ];
      
      // Datos de empleados más detallados
      result.employees = [
        { 
          name: 'Carlos Rodríguez', 
          role: 'Desarrollador Senior', 
          projects: 2, 
          workload: 85,
          skills: ['React', 'Node.js', 'MongoDB'],
          department: 'Tecnología',
          country: 'España',
          projectIds: [0, 3] 
        },
        { 
          name: 'Ana López', 
          role: 'Diseñadora UX/UI', 
          projects: 3, 
          workload: 92,
          skills: ['Figma', 'Adobe XD', 'Sketch'],
          department: 'Diseño',
          country: 'México',
          projectIds: [1, 2, 4] 
        },
        { 
          name: 'Miguel Sánchez', 
          role: 'QA Tester', 
          projects: 1, 
          workload: 65,
          skills: ['Selenium', 'Jest', 'Cypress'],
          department: 'Calidad',
          country: 'Colombia',
          projectIds: [2] 
        },
        { 
          name: 'Laura Gómez', 
          role: 'Analista de Datos', 
          projects: 2, 
          workload: 78,
          skills: ['Python', 'SQL', 'Power BI'],
          department: 'Análisis',
          country: 'Argentina',
          projectIds: [3, 4] 
        },
        { 
          name: 'Javier Martínez', 
          role: 'Desarrollador Full Stack', 
          projects: 3, 
          workload: 95,
          skills: ['Angular', 'Java', 'PostgreSQL'],
          department: 'Tecnología',
          country: 'España',
          projectIds: [0, 2, 3] 
        }
      ];
      
      // Añadir datos de actividades recientes
      result.activities = [
        { description: 'Implementación de autenticación OAuth', date: '2025-05-15', project: 'Sistema de Gestión Comercial', employee: 'Carlos Rodríguez' },
        { description: 'Diseño de interfaz de usuario para app móvil', date: '2025-05-17', project: 'Aplicación Móvil Corporativa', employee: 'Ana López' },
        { description: 'Testing de módulo de tickets', date: '2025-05-18', project: 'Portal de Atención al Cliente', employee: 'Miguel Sánchez' },
        { description: 'Desarrollo de dashboard de ventas', date: '2025-05-19', project: 'Sistema de Business Intelligence', employee: 'Laura Gómez' },
        { description: 'Optimización de API REST', date: '2025-05-20', project: 'Sistema de Gestión Comercial', employee: 'Javier Martínez' },
        { description: 'Implementación de notificaciones push', date: '2025-05-20', project: 'Aplicación Móvil Corporativa', employee: 'Carlos Rodríguez' }
      ];
      
      // Añadir datos de países
      result.countries = [
        { name: 'España', projectCount: 2, employeeCount: 2, activeProjects: 2 },
        { name: 'México', projectCount: 1, employeeCount: 1, activeProjects: 1 },
        { name: 'Colombia', projectCount: 1, employeeCount: 1, activeProjects: 0 },
        { name: 'Argentina', projectCount: 1, employeeCount: 1, activeProjects: 0 }
      ];
    }
    
    return result;
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    // Devolver datos de ejemplo en caso de error
    return {
      error: true,
      errorMessage: error.message,
      mockData: true,
      projects: [
        { name: 'Proyecto A', status: 'active', startDate: '2025-01-15', endDate: '2025-06-30', employees: 5 },
        { name: 'Proyecto B', status: 'active', startDate: '2025-02-20', endDate: '2025-08-15', employees: 3 }
      ],
      employees: [
        { name: 'Carlos Rodríguez', role: 'Desarrollador', projects: 2, workload: 85 },
        { name: 'Ana López', role: 'Diseñadora', projects: 3, workload: 92 }
      ]
    };
  }
}

/**
 * Obtiene datos para el asistente basados en la consulta del usuario
 */
async function getDataForQuery(query) {
  const dataTypes = analyzeQuery(query);
  const data = await getRelevantData(dataTypes);
  
  // Agregar estadísticas básicas
  if (data.projects) {
    data.statistics = {
      totalProjects: data.projects.length,
      activeProjects: data.projects.filter(p => p.status === 'active').length,
      delayedProjects: data.projects.filter(p => p.status === 'delayed').length
    };
  }
  
  return data;
}

/**
 * Función avanzada para generar respuestas localmente sin un modelo de IA
 * Esta función simula respuestas inteligentes basadas en datos de la aplicación
 */
function generateLocalResponse(query, data) {
  query = query.toLowerCase();
  
  // === RESPUESTAS SOBRE PROYECTOS ===
  
  // Proyectos activos
  if (query.includes('proyecto activo') || query.includes('proyectos activos')) {
    const activeProjects = data.projects?.filter(p => p.status === 'active') || [];
    let response = `Actualmente hay ${activeProjects.length} proyectos activos. `;
    
    if (activeProjects.length > 0) {
      response += '\n\nProyectos activos:';
      activeProjects.forEach(p => {
        const progress = p.completion || 0;
        const remainingDays = Math.round((new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        response += `\n• ${p.name} - ${progress}% completado, ${remainingDays} días restantes`;
      });
    }
    return response;
  }
  
  // Proyectos retrasados
  if (query.includes('proyecto retrasado') || query.includes('proyectos retrasados')) {
    const delayedProjects = data.projects?.filter(p => p.status === 'delayed') || [];
    let response = `Hay ${delayedProjects.length} proyectos retrasados. `;
    
    if (delayedProjects.length > 0) {
      response += '\n\nProyectos con retraso:';
      delayedProjects.forEach(p => {
        const reason = p.delayReason || 'Sin motivo especificado';
        response += `\n• ${p.name} - Motivo: ${reason}`;
      });
      response += '\n\nSe recomienda revisar estos proyectos y actualizar sus cronogramas.';
    }
    return response;
  }
  
  // Detalle de proyecto específico
  if (query.includes('detalle') && query.includes('proyecto')) {
    // Buscar un nombre de proyecto en la consulta
    const projectName = findProjectNameInQuery(query, data.projects);
    
    if (projectName) {
      const project = data.projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
      if (project) {
        return `Detalles del proyecto: ${project.name}\n\n` +
          `Estado: ${project.status === 'active' ? 'Activo' : 'Retrasado'}\n` +
          `Descripción: ${project.description}\n` +
          `Fecha inicio: ${project.startDate}\n` +
          `Fecha fin: ${project.endDate}\n` +
          `Progreso: ${project.completion || 0}%\n` +
          `País: ${project.country}\n` +
          `Equipo: ${project.teamType}\n` +
          `Empleados asignados: ${project.employees}\n` +
          `Presupuesto: ${project.budget} €`;
      }
    }
    
    return 'Para ver detalles de un proyecto, especifica el nombre del proyecto. Por ejemplo: "Muestra detalles del Sistema de Gestión Comercial".';
  }
  
  // === RESPUESTAS SOBRE EMPLEADOS ===
  
  // Empleados con mayor carga
  if ((query.includes('empleado') || query.includes('empleados')) && 
      (query.includes('carga') || query.includes('más activ') || query.includes('mayor trabajo'))) {
    const employees = data.employees || [];
    if (employees.length > 0) {
      // Ordenar empleados por carga de trabajo
      const sortedEmployees = [...employees].sort((a, b) => b.workload - a.workload);
      const topEmployee = sortedEmployees[0];
      
      let response = `El empleado con mayor carga de trabajo es ${topEmployee.name} con ${topEmployee.workload}% de ocupación en ${topEmployee.projects} proyectos.\n\n`;
      response += 'Top 3 empleados por carga de trabajo:\n';
      
      for (let i = 0; i < Math.min(3, sortedEmployees.length); i++) {
        const emp = sortedEmployees[i];
        response += `${i + 1}. ${emp.name} (${emp.role}) - ${emp.workload}% de carga\n`;
      }
      
      if (topEmployee.workload > 90) {
        response += '\n⚠️ Se recomienda revisar la distribución de carga de trabajo, hay empleados con posible sobrecarga.';
      }
      
      return response;
    }
  }
  
  // Detalle de empleado específico
  if (query.includes('detalle') && (query.includes('empleado') || query.includes('sobre'))) {
    // Buscar un nombre de empleado en la consulta
    const employeeName = findEmployeeNameInQuery(query, data.employees);
    
    if (employeeName) {
      const employee = data.employees.find(e => e.name.toLowerCase().includes(employeeName.toLowerCase()));
      if (employee) {
        // Obtener nombres de proyectos asignados
        const assignedProjects = employee.projectIds.map(id => data.projects[id]?.name || 'Proyecto desconocido');
        
        return `Detalles del empleado: ${employee.name}\n\n` +
          `Rol: ${employee.role}\n` +
          `Departamento: ${employee.department}\n` +
          `País: ${employee.country}\n` +
          `Carga de trabajo: ${employee.workload}%\n` +
          `Proyectos asignados: ${assignedProjects.join(', ')}\n` +
          `Habilidades: ${employee.skills.join(', ')}`;
      }
    }
    
    return 'Para ver detalles de un empleado, especifica su nombre. Por ejemplo: "Muestra detalles de Carlos Rodríguez".';
  }
  
  // === RESPUESTAS SOBRE ACTIVIDADES ===
  
  // Actividades recientes/del mes
  if (query.includes('actividad') || query.includes('actividades')) {
    const activities = data.activities || [];
    if (activities.length > 0) {
      let response = `Hay ${activities.length} actividades registradas recientemente:\n\n`;
      
      activities.forEach((activity, index) => {
        response += `${index + 1}. ${activity.description}\n`;
        response += `   Proyecto: ${activity.project} | Responsable: ${activity.employee} | Fecha: ${activity.date}\n`;
      });
      
      return response;
    }
    return 'No hay actividades registradas recientemente.';
  }
  
  // === RESPUESTAS SOBRE ANÁLISIS POR PAÍS ===
  
  if (query.includes('país') || query.includes('paises') || query.includes('países')) {
    const countries = data.countries || [];
    if (countries.length > 0) {
      let response = 'Distribución de proyectos por país:\n\n';
      
      countries.forEach(country => {
        const activeRatio = Math.round((country.activeProjects / country.projectCount) * 100);
        response += `• ${country.name}: ${country.projectCount} proyectos (${country.activeProjects} activos, ${activeRatio}%)\n`;
      });
      
      // Añadir un análisis básico
      const topCountry = [...countries].sort((a, b) => b.projectCount - a.projectCount)[0];
      response += `\nEl país con mayor concentración de proyectos es ${topCountry.name}.`;
      
      return response;
    }
  }
  
  // === RESPUESTA DE AYUDA ===
  
  if (query.includes('qué puedes hacer') || query.includes('ayuda') || query.includes('comandos')) {
    return `Puedo responder preguntas sobre DayLog y proporcionar análisis de datos. Algunas preguntas que puedes hacer:\n\n` +
      `📊 Proyectos:\n` +
      `• ¿Cuántos proyectos activos hay?\n` +
      `• ¿Qué proyectos están retrasados?\n` +
      `• Muestra detalles del proyecto [nombre]\n\n` +
      `👥 Empleados:\n` +
      `• ¿Qué empleados tienen mayor carga de trabajo?\n` +
      `• Muestra detalles de [nombre de empleado]\n\n` +
      `📝 Actividades:\n` +
      `• ¿Cuáles son las actividades recientes?\n\n` +
      `🌎 Análisis geográfico:\n` +
      `• Muestra distribución por países`;
  }
  
  // === RESPUESTA GENÉRICA ===
  
  const projectCount = data.projects?.length || 0;
  const employeeCount = data.employees?.length || 0;
  const activeProjectCount = data.projects?.filter(p => p.status === 'active').length || 0;
  
  return `En DayLog hay ${projectCount} proyectos registrados, de los cuales ${activeProjectCount} están activos, ` +
    `y ${employeeCount} empleados en el sistema.\n\n` +
    `Para obtener información más específica, puedes preguntar sobre:\n` +
    `• Proyectos activos o retrasados\n` +
    `• Detalles de un proyecto específico\n` +
    `• Empleados con mayor carga de trabajo\n` +
    `• Actividades recientes\n` +
    `• Distribución por países`;
}

/**
 * Funciones auxiliares para buscar entidades en las consultas
 */
function findProjectNameInQuery(query, projects) {
  if (!projects || !projects.length) return null;
  
  // Intentar encontrar un nombre de proyecto en la consulta
  for (const project of projects) {
    if (query.toLowerCase().includes(project.name.toLowerCase())) {
      return project.name;
    }
  }
  
  return null;
}

function findEmployeeNameInQuery(query, employees) {
  if (!employees || !employees.length) return null;
  
  // Intentar encontrar un nombre de empleado en la consulta
  for (const employee of employees) {
    const nameParts = employee.name.toLowerCase().split(' ');
    for (const part of nameParts) {
      if (part.length > 3 && query.toLowerCase().includes(part)) {
        return employee.name;
      }
    }
  }
  
  return null;
}

export {
  getDataForQuery,
  generateLocalResponse
};