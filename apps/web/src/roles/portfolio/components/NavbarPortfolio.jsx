import { useState, useEffect } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardMinus,
  Folder,
  ChartBar,
  Network,
  Bell,
  LogOut,
  User,
  LayoutGrid
} from 'lucide-react';
import LogoutModal from '../../admin/components/LogoutModal'; // Usando el mismo modal que en NavbarAdmin
import { useAuth } from '../../../context/authContext'; // Importar el AuthContext

const mainMenuItems = [
  {
    title: 'Inicio',
    to: '/portafolio/dashboard',
    icon: Home,
  },
  {
    title: 'Reportes',
    to: '/portafolio/empleados',
    icon: ClipboardMinus,
  },
  {
    title: 'Proyectos',
    to: '/portafolio/proyectos',
    icon: Folder,
  },
  {
    title: 'Rendimiento',
    to: '/portafolio/rendimiento',
    icon: ChartBar,
  },
  {
    title: 'Grupos de trabajo',
    to: '/portafolio/workteam',
    icon: Network,
  },
  {
    title: 'Cerrar sesión',
    to: '#',
    icon: LogOut,
  },

];

const bottomMenuItem = {
  title: 'Mi perfil',
  to: '/portafolio/perfil',
  icon: User,
};

// Hook personalizado para detectar tamaño de pantalla
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};



export default function NavbarPortfolio({ isExpanded: expandedProp = false, onExpandChange }) {
  const [isExpanded, setIsExpanded] = useState(expandedProp);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutClicked, setLogoutClicked] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 1200px)');
  const isMediumScreen = useMediaQuery('(min-width: 1201px) and (max-width: 1500px)');
  const navigate = useNavigate();
  
  // En pantallas pequeñas, siempre colapsado
  useEffect(() => {
    if (isSmallScreen && isExpanded) {
      setIsExpanded(false);
    }
  }, [isSmallScreen, isExpanded]);

  useEffect(() => {
    onExpandChange && onExpandChange(isExpanded);
  }, [isExpanded, onExpandChange]);

  const toggleExpanded = () => {
    if (!isSmallScreen && !isMediumScreen) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setLogoutClicked(true);
    setShowLogoutModal(true);
  };
 const { logOut} = useAuth();

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    // Aquí puedes agregar tu lógica de logout (limpiar tokens, etc.)
    logOut(); // Llamar a la función de logout del contexto
    navigate('/login');
    setLogoutClicked(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
    setLogoutClicked(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsExpanded]);

  return (
    <>
      <Motion.div
      animate={isSmallScreen 
        ? { height: 80, width: '100%', top: 0, left: 0, borderRadius: 0 } 
        : { 
            width: isExpanded ? 250 : 80,
            height: '85vh',
            top: '50%',
            left: '3rem',
            y: '-50%',
            borderRadius: '30px'
          }
      }
      transition={{ duration: 0.30, ease: [0.4, 0.0, 0.2, 1] }}
      className="fixed bg-white shadow-lg z-50 overflow-hidden flex items-center">
      <div className={`flex ${isSmallScreen ? 'flex-row w-full' : 'flex-col h-full'}`}>
        {/* Logo y encabezado */}
        <div className={`${isSmallScreen ? 'h-full flex items-center px-4' : 'h-20 flex items-center justify-center px-4 border-b border-gray-100'}`}>
          <div className="flex items-center">
            {!isExpanded && !isSmallScreen ? (
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/bancocuscatlan.svg" alt="Banco Cuscatlán" className="w-8 h-8" />
              </div>
            ) : (
              <div className="flex items-center">
                <img src="/bancocuscatlan.svg" alt="Banco Cuscatlán" className="w-8 h-8 mr-3" />
                {(isExpanded || isSmallScreen) && (
                  <div>
                    <span className="text-xl font-semibold" style={{ color: '#000000' }}>DayLog</span>
                    {!isSmallScreen && (
                      <>
                        <span className="ml-2 text-s text-gray-400 font-medium">|</span>
                        <span className="ml-2 text-s text-gray-400 font-medium">Portafolio</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Botón para expandir/contraer el menú - solo visible en pantallas grandes */}
        {!isSmallScreen && !isMediumScreen && (
          <div className="my-4 px-4">
            <button 
              onClick={toggleExpanded}
              className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-gray-100"
            >
              <LayoutGrid className="h-6 w-6" style={{ color: '#000000' }} />
            </button>
          </div>
        )}
        
        {/* Menú principal */}
        <nav className={`flex-1 ${isSmallScreen ? 'overflow-x-auto' : 'overflow-y-auto px-4'}`}>
          <ul className={`${isSmallScreen ? 'h-full flex items-center space-x-1 px-2' : 'space-y-1 py-2'}`}>
            {mainMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isLogoutItem = item.title === 'Cerrar sesión';
              return (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    end
                    onClick={isLogoutItem ? (e) => {
                      e.preventDefault();
                      handleLogoutClick(e);
                    } : undefined}
                    className={({ isActive }) => {
                      // Si es el botón de cerrar sesión, nunca mostrarlo como activo
                      if (isLogoutItem) isActive = false;
                      return `flex items-center ${isSmallScreen ? 'px-3 py-2' : 'w-full px-3 py-3'} rounded-lg transition-colors ${isActive ? 'bg-gray-50' : ''}`;
                    }}
                  >
                      {({ isActive }) => {
                        // Si es el botón de cerrar sesión, nunca mostrarlo como activo a menos que se haya hecho clic
                        if (isLogoutItem) isActive = logoutClicked;
                        
                        return (
                          <>
                            <Icon 
                              className="h-6 w-6" 
                              style={{ color: isActive ? '#D6AC50' : '#000000' }} 
                            />
                            <AnimatePresence>
                              {!isSmallScreen && isExpanded && (
                                <Motion.span
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  className="ml-3 flex-1 text-base font-semibold"
                                  style={{ color: isActive ? '#D6AC50' : '#8D91A0' }}
                                >
                                {item.title}
                              </Motion.span>
                            )}
                          </AnimatePresence>
                        </>
                        );
                      }}
                    </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Perfil (separado en la parte inferior) */}
        <div className={`${isSmallScreen ? 'h-full flex items-center ml-auto px-4' : 'mt-auto px-4 pb-8 pt-4 border-t border-gray-100'}`}>
          <NavLink
            to={bottomMenuItem.to}
            end
            className={({ isActive }) => 
              `flex items-center ${isSmallScreen ? 'px-3 py-2' : 'w-full px-3 py-3'} rounded-lg transition-colors ${isActive ? 'bg-gray-50' : ''}`
            }
          >
            {({ isActive }) => {
              const ProfileIcon = bottomMenuItem.icon;
              return (
                <>
                  <ProfileIcon 
                    className="h-6 w-6" 
                    style={{ color: isActive ? '#D6AC50' : '#000000' }} 
                  />
                  <AnimatePresence>
                    {!isSmallScreen && isExpanded && (
                      <Motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="ml-3 flex-1 text-base font-semibold"
                        style={{ color: isActive ? '#D6AC50' : '#8D91A0' }}
                      >
                        {bottomMenuItem.title}
                      </Motion.span>
                    )}
                  </AnimatePresence>
                </>
              );
            }}
          </NavLink>
        </div>
      </div>
    </Motion.div>

      {/* Modal de Logout */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
