// Configuración para lazy loading optimizado
export const lazyLoadConfig = {
  // Chunks por funcionalidad para mejor caching
  chunks: {
    // Componentes de gestión de empleados
    employeeManagement: () => import('../roles/admin/pages/EmployeeManagement/EmployeeManagement'),
    addEmployee: () => import('../roles/admin/pages/AddEmployee/AddEmployee'),
    editEmployee: () => import('../roles/admin/pages/EditEmployee/EditEmployee'),
    employeeDetails: () => import('../roles/admin/pages/EmployeeDetails/EmployeeDetails'),
    
    // Componentes de proyectos
    projects: () => import('../roles/admin/pages/Projects/Projects'),
    projectDetail: () => import('../roles/admin/pages/ProjectDetail/ProjectDetail'),
    projectsPortfolio: () => import('../roles/portfolio/pages/Projects/Projects'),
    projectDetailPortfolio: () => import('../roles/portfolio/pages/ProjectDetail/ProjectDetail'),
    addProjectPortfolio: () => import('../roles/portfolio/pages/AddProjects/AddProject'),
    editProjectPortfolio: () => import('../roles/portfolio/pages/EditProject/EditProject'),
    addResourcesPortfolio: () => import('../roles/portfolio/pages/AddResources/AddResources'),
    employeeProjects: () => import('../roles/employee/pages/Projects/Projects'),
    employeeProjectsDetails: () => import('../roles/employee/pages/ProjectsDetails/ProjectsDetails'),
    supervisorProjects: () => import('../roles/supervisor/pages/Projects/Projects'),
    supervisorProjectsDetails: () => import('../roles/supervisor/pages/ProjectsDetails/ProjectDetails'),
    
    // Componentes de equipos de trabajo
    workTeam: () => import('../roles/admin/pages/WorkTeam/WorkTeam'),
    addWorkTeam: () => import('../roles/admin/pages/WorkTeam/AddWorkTeam'),
    workTeamPortfolio: () => import('../roles/portfolio/pages/WorkTeam/WorkTeam'),
    
    // Componentes de actividades
    employeeActivities: () => import('../roles/employee/pages/Activities/Activities'),
    employeeWorkday: () => import('../roles/employee/pages/Workday/WorkDay'),
    supervisorProjectAct: () => import('../roles/supervisor/pages/ProjectEmployeeAct/EmployeeActivities'),
    supervisorAddAct: () => import('../roles/supervisor/pages/ProjectEmployeeAct/AddActivitie'),
    
    // Componentes de empleados (supervisor)
    supervisorEmployees: () => import('../roles/supervisor/pages/Employees/Employees'),
    
    // Componentes de permisos
    employeePermissions: () => import('../roles/employee/pages/Permissions/Permissions'),
    supervisorPermissions: () => import('../roles/supervisor/pages/Permissions/Permissions'),
    
    // Componentes de rendimiento
    employeePerformance: () => import('../roles/employee/pages/Performance/Performance'),
    performancePortfolio: () => import('../roles/portfolio/pages/Performance/PerformancePortfolio'),
    
    // Componentes de notificaciones
    adminNotifications: () => import('../roles/admin/pages/Notifications'),
    employeeNotifications: () => import('../roles/employee/pages/Notifications/Notifications'),
    supervisorNotifications: () => import('../roles/supervisor/pages/Notifications/Notifications'),
    
    // Componentes de perfil
    profile: () => import('../components/Profile/Profile'),
    portfolioProfile: () => import('../components/Profile/Profile'),
    employeeProfile: () => import('../components/Profile/Profile'),
    supervisorProfile: () => import('../components/Profile/Profile'),
    
    // Componentes especiales
    globalPage: () => import('../roles/admin/pages/Global'),
    rexAIPage: () => import('../roles/admin/pages/RexAI'),
    areaManagement: () => import('../roles/admin/pages/AreaManagement/AreaManagement'),
  },
  
  // Configuración de preloading por rol
  preloadByRole: {
    Admin: [
      'employeeManagement',
      'projects',
      'workTeam',
      'profile'
    ],
    Portafolio: [
      'projectsPortfolio',
      'performancePortfolio',
      'portfolioProfile'
    ],
    Empleado: [
      'employeeActivities',
      'employeeProjects',
      'employeeProfile'
    ],
    Supervisor: [
      'supervisorEmployees',
      'supervisorProjects',
      'supervisorProfile'
    ]
  }
};

// Función helper para cargar componentes con retry
export const lazyLoadWithRetry = (importFn, retries = 3) => {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount = 0) => {
      importFn()
        .then(resolve)
        .catch((error) => {
          if (retryCount < retries - 1) {
            console.warn(`Retry ${retryCount + 1} for component load`);
            setTimeout(() => attempt(retryCount + 1), 1000 * (retryCount + 1));
          } else {
            reject(error);
          }
        });
    };
    attempt();
  });
}; 