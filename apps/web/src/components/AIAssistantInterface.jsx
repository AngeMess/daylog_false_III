/**
 * Componente de Interfaz de Asistente de IA (Rexy)
 * 
 * Este componente proporciona una interfaz de chat interactiva para el asistente virtual Rexy.
 * Permite a los usuarios hacer preguntas sobre proyectos, empleados y actividades en DayLog.
 * 
 * Características principales:
 * - Chat en tiempo real con respuestas simuladas
 * - Sugerencias de comandos predefinidos
 * - Animaciones fluidas con Framer Motion
 * - Diseño responsivo para móviles y desktop
 * - Límite de mensajes para optimizar rendimiento
 * - Auto-scroll y botón para volver arriba
 * - Formateo automático de respuestas con listas y encabezados
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Command, MessageCircle, Zap, Search, Lightbulb, ArrowUp, X, ChevronDown } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import RexAIAnimation from './RexAIAnimation';

export function AIAssistantInterface() {
  const [inputValue, setInputValue] = useState("");
  const [activeCommandCategory, setActiveCommandCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const MAX_MESSAGES = 10; // Límite de mensajes a mantener

  const commandSuggestions = {
    learn: [
      "¿Qué información puedes mostrarme?",
      "¿Cómo puedo ver los proyectos activos?",
      "Explica cómo funcionan los grupos de trabajo",
      "¿Cuáles son las métricas principales?",
      "¿Cómo se calculan los retrasos de proyectos?",
    ],
    options: [
      "Muestra los proyectos activos",
      "¿Qué empleados tienen mayor carga de trabajo?",
      "Analiza los proyectos retrasados",
      "Compara rendimiento entre equipos",
      "¿Cuáles son las actividades realizadas este mes?",
    ],
  };

  // Datos simulados para las respuestas locales
  const mockData = {
    projects: [
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
      }
    ],
    employees: [
      { 
        name: 'Carlos Rodríguez', 
        role: 'Desarrollador Senior', 
        projects: 2, 
        workload: 85,
        skills: ['React', 'Node.js', 'MongoDB']
      },
      { 
        name: 'Ana López', 
        role: 'Diseñadora UX/UI', 
        projects: 3, 
        workload: 92,
        skills: ['Figma', 'Adobe XD', 'Sketch']
      },
      { 
        name: 'Miguel Sánchez', 
        role: 'QA Tester', 
        projects: 1, 
        workload: 65,
        skills: ['Selenium', 'Jest', 'Cypress']
      }
    ],
    activities: [
      { description: 'Implementación de autenticación OAuth', date: '2025-05-15', project: 'Sistema de Gestión Comercial', employee: 'Carlos Rodríguez' },
      { description: 'Diseño de interfaz de usuario para app móvil', date: '2025-05-17', project: 'Aplicación Móvil Corporativa', employee: 'Ana López' },
      { description: 'Testing de módulo de tickets', date: '2025-05-18', project: 'Portal de Atención al Cliente', employee: 'Miguel Sánchez' }
    ]
  };
  
  const handleCommandSelect = (command) => {
    setInputValue(command);
    setActiveCommandCategory(null);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Función para formatear el contenido del mensaje con listas y saltos de línea
  const formatMessageContent = (content) => {
    if (!content) return '';
    
    // Reemplazar saltos de línea
    const withLineBreaks = content.replace(/\n/g, '<br>');
    
    // Formatear listas con viñetas
    const withLists = withLineBreaks
      .replace(/• (.*?)(?=<br>|$)/g, '<span class="flex items-start"><span class="inline-block w-4 h-4 mr-1 text-[#01426A]">•</span><span>$1</span></span>')
      .replace(/- (.*?)(?=<br>|$)/g, '<span class="flex items-start"><span class="inline-block w-4 h-4 mr-1 text-[#01426A]">•</span><span>$1</span></span>');
    
    // Formatear encabezados
    const withHeadings = withLists
      .replace(/📊 (.*?)(?=<br>|$)/g, '<span class="block font-semibold text-[#01426A] mt-2 mb-1">$1</span>')
      .replace(/👥 (.*?)(?=<br>|$)/g, '<span class="block font-semibold text-[#01426A] mt-2 mb-1">$1</span>')
      .replace(/📋 (.*?)(?=<br>|$)/g, '<span class="block font-semibold text-[#01426A] mt-2 mb-1">$1</span>');
    
    // Crear elemento div y asignar HTML
    const div = document.createElement('div');
    div.innerHTML = withHeadings;
    
    // Devolver HTML como cadena
    return div.innerHTML;
  };

  // Función que genera respuestas localmente sin necesidad de backend
  const generateLocalResponse = (query) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Proyectos activos
    if (normalizedQuery.includes('proyectos activos') || normalizedQuery.includes('mostrar proyectos')) {
      const activeProjects = mockData.projects.filter(p => p.status === 'active');
      
      return `📊 Proyectos Activos (${activeProjects.length}):\n\n` +
        activeProjects.map(p => 
          `• ${p.name}\n` +
          `  - Fecha fin: ${p.endDate}\n` +
          `  - Progreso: ${p.completion}%\n` +
          `  - País: ${p.country}\n`
        ).join('\n');
    }
    
    // Proyectos retrasados
    if (normalizedQuery.includes('retras') || normalizedQuery.includes('demor')) {
      const delayedProjects = mockData.projects.filter(p => p.status === 'delayed');
      
      return `📊 Proyectos Retrasados (${delayedProjects.length}):\n\n` +
        delayedProjects.map(p => 
          `• ${p.name}\n` +
          `  - Fecha fin prevista: ${p.endDate}\n` +
          `  - Progreso actual: ${p.completion}%\n` +
          `  - Motivo: ${p.delayReason || 'No especificado'}\n`
        ).join('\n');
    }
    
    // Empleados y carga de trabajo
    if (normalizedQuery.includes('empleado') || normalizedQuery.includes('carga de trabajo')) {
      const sortedEmployees = [...mockData.employees].sort((a, b) => b.workload - a.workload);
      
      return `👥 Carga de Trabajo de Empleados:\n\n` +
        sortedEmployees.map(e => 
          `• ${e.name} (${e.role})\n` +
          `  - Carga actual: ${e.workload}%\n` +
          `  - Proyectos asignados: ${e.projects}\n` +
          `  - Habilidades: ${e.skills.join(', ')}\n`
        ).join('\n');
    }
    
    // Actividades recientes
    if (normalizedQuery.includes('actividad') || normalizedQuery.includes('reciente')) {
      return `📋 Actividades Recientes:\n\n` +
        mockData.activities.map(a => 
          `• ${a.date}: ${a.description}\n` +
          `  - Proyecto: ${a.project}\n` +
          `  - Responsable: ${a.employee}\n`
        ).join('\n');
    }
    
    // Ayuda
    if (normalizedQuery.includes('qué puedes') || normalizedQuery.includes('ayuda') || normalizedQuery.includes('hola')) {
      return `Hola, soy Rexy, tu asistente virtual. Puedo responder preguntas sobre DayLog como:\n\n` +
        `📊 Proyectos:\n` +
        `• Muestra los proyectos activos\n` +
        `• ¿Hay proyectos retrasados?\n\n` +
        `👥 Empleados:\n` +
        `• ¿Qué empleados tienen mayor carga de trabajo?\n` +
        `• Información sobre asignaciones de equipos\n\n` +
        `📋 Actividades:\n` +
        `• ¿Cuáles son las actividades recientes?\n` +
        `• Mostrar últimas actualizaciones de proyectos`;
    }
    
    // Respuesta por defecto
    return `No he podido entender completamente tu consulta. Prueba a preguntar sobre:\n\n` +
      `• Proyectos activos o retrasados\n` +
      `• Carga de trabajo de los empleados\n` +
      `• Actividades recientes\n\n` +
      `O escribe "ayuda" para ver todas las opciones.`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Añadir mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    
    // Limpiar input y mostrar indicador de carga
    setInputValue('');
    setIsLoading(true);
    
    // Simular tiempo de respuesta
    setTimeout(() => {
      // Generar respuesta local
      const response = generateLocalResponse(inputValue);
      
      // Añadir respuesta del asistente
      setMessages(prev => {
        // Limitar cantidad de mensajes guardados
        const updatedMessages = [...prev, { role: 'assistant', content: response }];
        if (updatedMessages.length > MAX_MESSAGES * 2) {
          return updatedMessages.slice(-MAX_MESSAGES * 2);
        }
        return updatedMessages;
      });
      
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // Tiempo aleatorio entre 1-2 segundos
  };
  
  // Desplazar al final de los mensajes cuando se añadan nuevos
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Controlar la visibilidad del botón de scroll
  useEffect(() => {
    if (!messageContainerRef.current) return;
    
    const handleScroll = () => {
      const { scrollTop } = messageContainerRef.current;
      setShowScrollTop(scrollTop > 300);
    };
    
    const messageContainer = messageContainerRef.current;
    messageContainer.addEventListener('scroll', handleScroll);
    
    return () => {
      messageContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Función para desplazar hacia arriba
  const scrollToTop = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Variantes de animación para diferentes elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Fondo con partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <Motion.div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#01426A]"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.3
              }}
              animate={{ 
                x: [
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%'
                ]
              }}
              transition={{ 
                duration: 20 + Math.random() * 30, 
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Círculo decorativo */}
        <Motion.div
          className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full border border-[#01426A]/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Cabecera */}
      <Motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-3 border-b border-slate-200 bg-white/70 backdrop-blur-md z-10 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#01426A] to-[#026BB3] text-white flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-[#01426A]">Rexy</h2>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Activo ahora
            </div>
          </div>
        </div>
      </Motion.div>
      
      {/* Contenedor de mensajes */}
      <div 
        ref={messageContainerRef} 
        className="flex-1 overflow-y-auto p-4 pb-5 relative"
        onScroll={() => {
          const { scrollTop } = messageContainerRef.current;
          setShowScrollTop(scrollTop > 300);
        }}
      >
        <Motion.div 
          className="max-w-[850px] mx-auto space-y-6 py-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {messages.length === 0 && (
            <Motion.div 
              className="flex flex-col items-center justify-center text-center px-4 py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Motion.div
                className="flex items-center justify-center mb-6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <RexAIAnimation className="scale-125" />
              </Motion.div>
              <h3 className="text-xl font-semibold text-[#01426A] mb-2">Rexy a tu servicio</h3>
              <p className="text-slate-500 max-w-md mb-8">Tu asistente inteligente para obtener información sobre proyectos, empleados y actividades en DayLog.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-md">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Proyectos activos" },
                  { icon: <MessageCircle className="w-4 h-4" />, text: "Estado de empleados" },
                  { icon: <Lightbulb className="w-4 h-4" />, text: "Actividades recientes" },
                ].map((item, i) => (
                  <Motion.button
                    key={i}
                    className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-[#FFC600] hover:shadow-md transition-all text-left"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCommandSelect(item.text)}
                  >
                    <span className="text-[#01426A]">{item.icon}</span>
                    <span className="text-xs font-medium text-slate-700">{item.text}</span>
                  </Motion.button>
                ))}
              </div>
            </Motion.div>
          )}
          
          {messages.length > 0 && (
            <div className="mb-4 text-center">
              <p className="text-xs text-slate-400">
                {messages.length > MAX_MESSAGES * 2 ? 
                  `Mostrando los últimos ${MAX_MESSAGES} mensajes` : 
                  `Historial de conversación (${Math.ceil(messages.length/2)} de ${MAX_MESSAGES})`}
              </p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <Motion.div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              variants={messageVariants}
            >
              <div
                className={`relative max-w-[85%] p-4 rounded-2xl ${msg.role === "user"
                  ? "bg-gradient-to-br from-[#01426A] to-[#01426A]/90 text-white"
                  : "bg-white shadow-sm border border-slate-200 text-slate-800"
                } ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              >
                {/* Contenido del mensaje con formato mejorado */}
                <div className={`text-sm ${msg.role === "user" ? "text-white" : "text-slate-700"}`}
                  dangerouslySetInnerHTML={{ __html: msg.role === 'user' ? msg.content : formatMessageContent(msg.content) }}
                />
                
                {/* Timestamp */}
                <div className={`text-[10px] mt-2 text-right ${msg.role === "user" ? "text-white/70" : "text-slate-400"}`}>
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </Motion.div>
          ))}

          {/* Indicador de escritura */}
          {isLoading && (
            <Motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="max-w-[85%] p-3 rounded-2xl rounded-tl-sm bg-white shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 px-2">
                  <Motion.div 
                    className="w-2 h-2 rounded-full bg-[#01426A]"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <Motion.div 
                    className="w-2 h-2 rounded-full bg-[#01426A]"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <Motion.div 
                    className="w-2 h-2 rounded-full bg-[#01426A]"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </Motion.div>
          )}

          {/* Referencia para auto-scroll */}
          <div ref={messagesEndRef} />
        </Motion.div>
        
        {/* Botón para volver arriba */}
        <AnimatePresence>
          {showScrollTop && (
            <Motion.button
              className="fixed bottom-24 right-8 w-10 h-10 rounded-full bg-[#01426A] text-white shadow-md flex items-center justify-center z-50"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp className="w-5 h-5" />
            </Motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Área de entrada de mensajes */}
      <Motion.div 
        className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-[850px] mx-auto">
          <div className="relative flex items-end gap-2">
            {/* Campo de entrada principal */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Escribe un mensaje a Rexy..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full p-3 pl-4 pr-12 rounded-full border border-slate-200 shadow-sm focus:border-[#01426A] focus:ring-1 focus:ring-[#01426A]/30 outline-none bg-white/90 backdrop-blur-sm text-slate-700 placeholder-slate-400 transition-all"
              />
              
              {/* Botón de enviar */}
              <Motion.button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${inputValue.trim()
                  ? "bg-gradient-to-r from-[#01426A] to-[#01426A] text-white shadow-md"
                  : "bg-slate-100 text-slate-400"}`}
                whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
                whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
              >
                <Send className="w-4 h-4" />
              </Motion.button>
            </div>
            
            {/* Botón de comandos */}
            <Motion.button 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeCommandCategory ? "bg-[#FFC600] text-[#01426A] shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCommandCategory(activeCommandCategory ? null : "options")}
            >
              <Command className="w-5 h-5" />
            </Motion.button>
          </div>
          
          {/* Panel de sugerencias */}
          <AnimatePresence>
            {activeCommandCategory && (
              <Motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mt-3 overflow-hidden"
              >
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="border-b border-slate-100 p-3 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-[#01426A]">
                      {activeCommandCategory === "learn" ? "Sugerencias de aprendizaje" : "Comandos rápidos"}
                    </h3>
                    <Motion.button 
                      className="text-slate-400 hover:text-slate-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCommandCategory(null)}
                    >
                      <X className="w-4 h-4" />
                    </Motion.button>
                  </div>
                  
                  <div className="p-2 max-h-[200px] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {commandSuggestions[activeCommandCategory || "options"]?.map((suggestion, index) => (
                        <Motion.button
                          key={index}
                          className="flex items-center gap-2 p-3 text-left rounded-lg hover:bg-slate-50 transition-colors"
                          onClick={() => handleCommandSelect(suggestion)}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#01426A]/10 flex items-center justify-center text-[#01426A]">
                            {index % 3 === 0 ? <Search className="w-4 h-4" /> : 
                             index % 3 === 1 ? <Zap className="w-4 h-4" /> : 
                             <Lightbulb className="w-4 h-4" />}
                          </span>
                          <span className="text-sm text-slate-700">{suggestion}</span>
                        </Motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </Motion.div>
    </div>
  );
}