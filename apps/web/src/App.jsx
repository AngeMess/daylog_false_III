import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect, Suspense, lazy } from "react";
import LoadingScreen from "./components/LoadingScreen";

// Imports síncronos (componentes críticos que se cargan inmediatamente)
import FirstPasswordChange2 from "./pages/FirstPasswordChange2";
import Layout from "./roles/admin/components/Layout";
import Dashboard from "./roles/admin/components/Dashboard";
import LayoutPortfolio from "./roles/portfolio/components/Layout";
import DashboardPortfolio from "./roles/portfolio/pages/Dashboard/DashboardPortfolio";

// Imports únicos (Eliminé los duplicados de los componentes ya cargados con lazy)
import PerformancePortfolio from "./roles/portfolio/pages/Performance/PerformancePortfolio";
import ProjectsPortfolio from "./roles/portfolio/pages/Projects/Projects";
import ProjectDetailPortfolio from "./roles/portfolio/pages/ProjectDetail/ProjectDetail";
import EditProjectPortfolio from "./roles/portfolio/pages/EditProject/EditProject";
import AddProjectPortfolio from "./roles/portfolio/pages/AddProjects/AddProject";
import AddResourcesPortfolio from "./roles/portfolio/pages/AddResources/AddResources";
import WorkTeamPortfolio from "./roles/portfolio/pages/WorkTeam/WorkTeam";
//import AddWorkTeamPortfolio from './roles/portfolio/pages/WorkTeam/AddWorkTeam';
import PortfolioProfile from "../src/components/Profile/Profile";
import ReportPortfolio from "./roles/portfolio/pages/Reports/Reports";

// Employee imports
import LayoutEmployee from "./roles/employee/components/Layout";
import EmployeeDashboard from "./roles/employee/pages/Dashboard/Dashboard";
import LayoutSupervisor from "./roles/supervisor/components/Layout";
import SupervisorDashboard from "./roles/supervisor/pages/Dashboard/Dashboard";
import Login from "./components/Login";
import LoadingScreenMain from "./components/LoadingScreenMain";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider, useAuth } from "./context/authContext";
import { SessionTimeoutProvider } from "./context/SessionTimeoutContext";
import PasswordResetFlow from "./roles/admin/components/RecoveryPasswordAdmin";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/PrivateRoute";
import SessionTimeoutWrapper from "./components/WrapperSessionTimeOut";
import PreloadManager from "./components/PreloadManager";
import ErrorBoundary from "./components/ErrorBoundary";

//  IMPORTS DEL SISTEMA DE TOASTS
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ToastContainer";
import { LoadingState } from "./components/ui/stateHandler";

// Lazy loading para componentes Admin
const EmployeeManagement = lazy(
  () => import("./roles/admin/pages/EmployeeManagement/EmployeeManagement")
);
const AddEmployee = lazy(
  () => import("./roles/admin/pages/AddEmployee/AddEmployee")
);
const Projects = lazy(() => import("./roles/admin/pages/Projects/Projects"));
const ProjectDetail = lazy(
  () => import("./roles/admin/pages/ProjectDetail/ProjectDetail")
);
const Profile = lazy(() => import("../src/components/Profile/Profile"));
const WorkTeam = lazy(() => import("./roles/admin/pages/WorkTeam/WorkTeam"));
const GlobalPage = lazy(() => import("./roles/admin/pages/Global"));
const AgregarGrupo = lazy(
  () => import("./roles/admin/pages/WorkTeam/AddWorkTeam")
);
const RexAIPage = lazy(() => import("./roles/admin/pages/RexAI"));
const AdminNotifications = lazy(
  () => import("./roles/admin/pages/Notifications")
);
const EditEmployee = lazy(
  () => import("./roles/admin/pages/EditEmployee/EditEmployee")
);
const AreaManagement = lazy(
  () => import("./roles/admin/pages/AreaManagement/AreaManagement")
);
const EmployeeDetails = lazy(
  () => import("./roles/admin/pages/EmployeeDetails/EmployeeDetails")
);

// Lazy loading para componentes Employee
const EmployeeActivities = lazy(
  () => import("./roles/employee/pages/Activities/Activities")
);
const EmployeeWorkday = lazy(
  () => import("./roles/employee/pages/Workday/WorkDay")
);
const EmployeeProjects = lazy(
  () => import("./roles/employee/pages/Projects/Projects")
);
const EmployeeProjectsDetails = lazy(
  () => import("./roles/employee/pages/ProjectsDetails/ProjectsDetails")
);
const EmployeePermissions = lazy(
  () => import("./roles/employee/pages/Permissions/Permissions")
);
const EmployeePerformance = lazy(
  () => import("./roles/employee/pages/Performance/Performance")
);
const EmployeeNotifications = lazy(
  () => import("./roles/employee/pages/Notifications/Notifications")
);
const EmployeeProfile = lazy(() => import("../src/components/Profile/Profile"));

// Lazy loading para componentes Supervisor
const SupervisorEmployees = lazy(
  () => import("./roles/supervisor/pages/Employees/Employees")
);
const SupervisorProjects = lazy(
  () => import("./roles/supervisor/pages/Projects/Projects")
);
const SupervisorProjectsDetails = lazy(
  () => import("./roles/supervisor/pages/ProjectsDetails/ProjectDetails")
);
const SupervisorProjectAct = lazy(
  () => import("./roles/supervisor/pages/ProjectEmployeeAct/EmployeeActivities")
);
const SupervisorAddAct = lazy(
  () => import("./roles/supervisor/pages/ProjectEmployeeAct/AddActivitie")
);
const SupervisorPermissions = lazy(
  () => import("./roles/supervisor/pages/Permissions/Permissions")
);
const SupervisorNotifications = lazy(
  () => import("./roles/supervisor/pages/Notifications/Notifications")
);
const SupervisorProfile = lazy(
  () => import("../src/components/Profile/Profile")
);
const SupervisorEmployeeDetails = lazy(
  () => import("./roles/supervisor/pages/Employees/EmployeeDetails")
);
const AddReminder = lazy(
  () => import("./roles/supervisor/pages/Employees/AddReminder")
);

import "./App.css";

// Componente interno que maneja el loading después de que AuthProvider esté montado
const AppContent = () => {
  const { loading: authLoading } = useAuth();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // Solo mostrar loading de la app si no hay sesión guardada
    const savedUserData = localStorage.getItem("userData");

    if (savedUserData) {
      // Si hay sesión guardada, no mostrar loading de app, ir directo a verificación
      setAppLoading(false);
    } else {
      // Si no hay sesión, mostrar loading de app por tiempo reducido
      setTimeout(() => {
        setAppLoading(false);
      }, 2000); // Reducido de 5s a 2s
    }
  }, []);

  // Mostrar loading mientras se verifica la autenticación O mientras carga la app
  if (appLoading || authLoading) {
    return <LoadingScreenMain />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SessionTimeoutProvider>
          <NotificationProvider>
            {/* 🆕 PROVEEDOR DE TOASTS - Envuelve toda la aplicación */}
            <ToastProvider>
              <SessionTimeoutWrapper>
                <PreloadManager />

                {/* 🆕 CONTENEDOR DE TOASTS GLOBALES */}
                <ToastContainer />

                {/* MANTENER EL TOASTER EXISTENTE PARA COMPATIBILIDAD */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                  }}
                />

                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/recovery-password"
                    element={<PasswordResetFlow />}
                  />
                  <Route
                    path="/first-password-change"
                    element={<FirstPasswordChange2 />}
                  />
                  <Route path="/" element={<Navigate to="/login" />} />

                  {/* Rutas del dashboard ADMIN - PROTEGIDAS */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedUserTypes={["Admin"]}>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/admin/dashboard" replace />}
                    />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route
                      path="gestionEmpleados"
                      element={
                        <Suspense fallback={null}>
                          <EmployeeManagement />
                        </Suspense>
                      }
                    />
                    <Route
                      path="grupos"
                      element={
                        <Suspense fallback={null}>
                          <WorkTeam />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos"
                      element={
                        <Suspense fallback={null}>
                          <Projects />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos/detalle-proyecto/:id"
                      element={
                        <Suspense fallback={null}>
                          <ProjectDetail />
                        </Suspense>
                      }
                    />
                    <Route
                      path="gestionEmpleados/detalle-empleado/:id"
                      element={
                        <Suspense fallback={null}>
                          <EmployeeDetails />
                        </Suspense>
                      }
                    />
                    <Route
                      path="gestionEmpleados/editar-empleado/:id"
                      element={
                        <Suspense fallback={null}>
                          <EditEmployee />
                        </Suspense>
                      }
                    />
                    <Route
                      path="gestionEmpleados/agregar-empleado"
                      element={
                        <Suspense fallback={null}>
                          <AddEmployee />
                        </Suspense>
                      }
                    />
                    <Route
                      path="grupos/agregar-grupo"
                      element={
                        <Suspense fallback={null}>
                          <AgregarGrupo />
                        </Suspense>
                      }
                    />
                    <Route
                      path="global"
                      element={
                        <Suspense fallback={null}>
                          <GlobalPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="rexai"
                      element={
                        <Suspense fallback={null}>
                          <RexAIPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="notificaciones"
                      element={
                        <Suspense fallback={null}>
                          <AdminNotifications />
                        </Suspense>
                      }
                    />
                    <Route
                      path="perfil"
                      element={
                        <Suspense fallback={null}>
                          <Profile />
                        </Suspense>
                      }
                    />
                    <Route
                      path="gestion-areas"
                      element={
                        <Suspense fallback={null}>
                          <AreaManagement />
                        </Suspense>
                      }
                    />
                  </Route>

                  {/* Rutas del dashboard PORTFOLIO - PROTEGIDAS */}
                  <Route
                    path="/portafolio"
                    element={
                      <ProtectedRoute allowedUserTypes={["Portafolio"]}>
                        <LayoutPortfolio />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/portafolio/dashboard" replace />}
                    />
                    <Route path="dashboard" element={<DashboardPortfolio />} />
                    <Route
                      path="empleados"
                      element={
                        <Suspense fallback={null}>
                          <ReportPortfolio />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos"
                      element={
                        <Suspense fallback={null}>
                          <ProjectsPortfolio />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos/agregar-proyecto"
                      element={
                        <Suspense fallback={null}>
                          <AddProjectPortfolio />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos/editar-proyecto/:id"
                      element={
                        <Suspense fallback={null}>
                          <EditProjectPortfolio />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos/detalle-proyecto/:id"
                      element={
                        <Suspense fallback={null}>
                          <ProjectDetailPortfolio />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos/agregar-recursos/:id"
                      element={
                        <Suspense fallback={null}>
                          <AddResourcesPortfolio />
                        </Suspense>
                      }
                    />
                    <Route
                      path="rendimiento"
                      element={
                        <Suspense fallback={null}>
                          <PerformancePortfolio />
                        </Suspense>
                      }
                    />
                    <Route
                      path="workteam"
                      element={
                        <Suspense fallback={null}>
                          <WorkTeamPortfolio />
                        </Suspense>
                      }
                    />
                    <Route
                      path="perfil"
                      element={
                        <Suspense fallback={null}>
                          <PortfolioProfile />
                        </Suspense>
                      }
                    />
                  </Route>

                  {/* Rutas del dashboard EMPLOYEE - PROTEGIDAS */}
                  <Route
                    path="/employee"
                    element={
                      <ProtectedRoute allowedUserTypes={["Empleado"]}>
                        <LayoutEmployee />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/employee/dashboard" replace />}
                    />
                    <Route path="dashboard" element={<EmployeeDashboard />} />
                    <Route
                      path="actividades"
                      element={
                        <Suspense fallback={null}>
                          <EmployeeActivities />
                        </Suspense>
                      }
                    />
                    <Route
                      path="jornada"
                      element={
                        <Suspense fallback={null}>
                          <EmployeeWorkday />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos"
                      element={
                        <Suspense fallback={null}>
                          <EmployeeProjects />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos/detalle-proyecto/:id"
                      element={
                        <Suspense fallback={null}>
                          <EmployeeProjectsDetails />
                        </Suspense>
                      }
                    />
                    <Route
                      path="permisos"
                      element={
                        <Suspense fallback={null}>
                          <EmployeePermissions />
                        </Suspense>
                      }
                    />
                    <Route
                      path="rendimiento"
                      element={
                        <Suspense fallback={null}>
                          <EmployeePerformance />
                        </Suspense>
                      }
                    />
                    <Route
                      path="notificaciones"
                      element={
                        <Suspense fallback={null}>
                          <EmployeeNotifications />
                        </Suspense>
                      }
                    />
                    <Route
                      path="perfil"
                      element={
                        <Suspense fallback={null}>
                          <EmployeeProfile />
                        </Suspense>
                      }
                    />
                  </Route>

                  {/* Rutas del dashboard SUPERVISOR - PROTEGIDAS */}
                  <Route
                    path="/supervisor"
                    element={
                      <ProtectedRoute allowedUserTypes={["Supervisor"]}>
                        <LayoutSupervisor />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/supervisor/dashboard" replace />}
                    />
                    <Route path="dashboard" element={<SupervisorDashboard />} />
                    <Route
                      path="empleados"
                      element={
                        <Suspense fallback={null}>
                          <SupervisorEmployees />
                        </Suspense>
                      }
                    />
                    <Route
                      path="empleados/detalle-empleado/:id"
                      element={
                        <Suspense
                          fallback={
                            <LoadingState message="Cargando detalles del empleado..." />
                          }
                        >
                          <SupervisorEmployeeDetails />
                        </Suspense>
                      }
                    />
                    <Route
                      path="empleados/agregar-recordatorio/:id"
                      element={
                        <Suspense
                          fallback={
                            <LoadingState message="Cargando formulario..." />
                          }
                        >
                          <AddReminder />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/supervisor/proyectos"
                      element={<SupervisorProjects />}
                    />
                    {/* Ruta para el detalle del proyecto, con un parámetro dinámico :id */}
                    <Route
                      path="/supervisor/proyectos/detalle-proyecto/:id"
                      element={<SupervisorProjectsDetails />}
                    />
                    <Route
                      path="proyectos/detalle-proyecto-act"
                      element={
                        <Suspense fallback={null}>
                          <SupervisorProjectAct />
                        </Suspense>
                      }
                    />
                    <Route
                      path="proyectos/detalle-proyecto-act/agregar-actividad"
                      element={
                        <Suspense fallback={null}>
                          <SupervisorAddAct />
                        </Suspense>
                      }
                    />
                    <Route
                      path="permisos"
                      element={
                        <Suspense fallback={null}>
                          <SupervisorPermissions />
                        </Suspense>
                      }
                    />
                    <Route
                      path="notificaciones"
                      element={
                        <Suspense fallback={null}>
                          <SupervisorNotifications />
                        </Suspense>
                      }
                    />
                    <Route
                      path="perfil"
                      element={
                        <Suspense fallback={null}>
                          <SupervisorProfile />
                        </Suspense>
                      }
                    />
                  </Route>

                  {/* Ruta de cierre de sesión */}
                  <Route path="/logout" element={<Navigate to="/login" />} />

                  {/* Ruta 404 - Página no encontrada */}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </SessionTimeoutWrapper>
            </ToastProvider>
          </NotificationProvider>
        </SessionTimeoutProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;
