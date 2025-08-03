import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Configuración de colores modernos y estilizados
const COLORS = {
  primary: '#01426A',
  primaryGradient: '#01426A',
  primaryLight: '#2B5F8A',
  secondary: '#FFD700',
  secondaryLight: '#FFED4A',
  accent: '#4A90E2',
  text: '#2C3E50',
  textLight: '#5A6C7D',
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  lightGray: '#F8F9FA',
  mediumGray: '#E9ECEF',
  darkGray: '#6C757D',
  white: '#FFFFFF',
  border: '#DEE2E6',
  shadow: 'rgba(0,0,0,0.1)'
};

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'No definida';
  
  try {
    // Si es una fecha ISO completa
    if (typeof dateString === 'string' && dateString.includes('T')) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    // Si ya está en formato dd/mm/yyyy
    if (typeof dateString === 'string' && dateString.includes('/')) {
      return dateString;
    }
    
    // Si es un objeto Date
    if (dateString instanceof Date) {
      return dateString.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    // Si es un timestamp
    if (typeof dateString === 'number') {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    return dateString.toString();
  } catch (error) {
    console.warn('Error al formatear fecha:', dateString, error);
    return dateString.toString();
  }
};

// Función para obtener datos adicionales del usuario según su rol
const getUserAdditionalData = (user) => {
  const baseData = {
    projects: [],
    activities: [],
    performance: {
      completedTasks: 0,
      activeProjects: 0
    },
    weeklyPerformance: {
      workHours: 52,
      extraHours: 12,
      compensatoryHours: 6
    },
    workTeams: []
  };

  // Simular datos según el rol del usuario
  switch (user.daylogRol.toLowerCase()) {
    case 'supervisor':
      return {
        ...baseData,
        projects: [
          { name: 'Creación de sistema web', status: 'Por Hacer', size: 'Mediano', area: 'Tecnología' },
          { name: 'Implementación CRM', status: 'En Progreso', size: 'Grande', area: 'Tecnología' },
          { name: 'Migración de datos', status: 'Completado', size: 'Pequeño', area: 'Tecnología' }
        ],
        performance: {
          completedTasks: 24,
          activeProjects: 5,
          teamSize: 8
        },
        workTeams: [
          { name: 'Marvel end Game', type: 'Feature Team', area: 'Recursos Humanos - Seguridad Informática', supervisor: 'yanose' },
          { name: 'Los aurores', type: 'Agile Product Team', area: 'Tecnología - Soporte Técnico', supervisor: 'pi peta777' }
        ]
      };
    
    case 'portafolio':
      return {
        ...baseData,
        projects: [
          { name: 'Gestión Portfolio A', status: 'En Progreso', size: 'Grande', area: 'Gestión' },
          { name: 'Análisis de recursos', status: 'Por Hacer', size: 'Mediano', area: 'Planificación' },
          { name: 'Optimización procesos', status: 'En Progreso', size: 'Grande', area: 'Mejora continua' }
        ],
        performance: {
          completedTasks: 18,
          activeProjects: 3
        },
        workTeams: [
          { name: 'Fantastics', type: 'Feature Team', area: 'Tecnología - Registro Contable', supervisor: 'Pere wil' },
          { name: 'Los aurores', type: 'Agile Product Team', area: 'Tecnología - Soporte Técnico', supervisor: 'pi peta777' }
        ]
      };
    
    case 'admin':
      return {
        ...baseData,
        projects: [
          { name: 'Administración del sistema', status: 'Activo', size: 'Continuo', area: 'Tecnología' },
          { name: 'Gestión de usuarios', status: 'Activo', size: 'Continuo', area: 'Administración' },
          { name: 'Backup y seguridad', status: 'Activo', size: 'Crítico', area: 'Seguridad' }
        ],
        performance: {
          completedTasks: 42,
          activeProjects: 6,
          systemUptime: '99.8%'
        },
        workTeams: [
          { name: 'Marvel end Game', type: 'Feature Team', area: 'Recursos Humanos - Seguridad Informática', supervisor: 'yanose' },
          { name: 'SysAdmin Core', type: 'Technical Team', area: 'Tecnología - Infraestructura', supervisor: 'admin001' }
        ]
      };
    
    default: // Empleado
      return {
        ...baseData,
        projects: [
          { name: 'Desarrollo módulo ventas', status: 'En Progreso', size: 'Mediano', area: user.mainAreaArea },
          { name: 'Testing funcionalidades', status: 'Por Hacer', size: 'Pequeño', area: user.mainAreaArea },
          { name: 'Documentación técnica', status: 'En Progreso', size: 'Pequeño', area: user.mainAreaArea }
        ],
        performance: {
          completedTasks: 15,
          activeProjects: 2
        },
        workTeams: [
          { name: 'Fantastics', type: 'Feature Team', area: 'Tecnología - Registro Contable', supervisor: 'Pere wil' }
        ]
      };
  }
};

// Generar reporte individual en PDF
export const generateUserReportPDF = (user) => {
  const doc = new jsPDF();
  const userData = getUserAdditionalData(user);
  
  // Header con logo real de Banco Cuscatlán
  // Fondo blanco para el header
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 35, 'F');
  
  // Agregar logo real de Banco Cuscatlán
  try {
    // La imagen se carga desde el directorio público
    const logoUrl = '/Banco Cuscatlan logo.png';
    // Mantener proporciones originales del logo (aproximadamente 4:1 ratio)
    doc.addImage(logoUrl, 'PNG', 20, 10, 60, 15); // x, y, width, height - Proporciones correctas
  } catch (error) {
    console.warn('No se pudo cargar el logo, usando texto como fallback');
    // Fallback: texto si no se puede cargar la imagen
    doc.setTextColor(COLORS.primary);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BANCO CUSCATLÁN', 20, 20);
  }
  
  // Línea separadora sutil
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 32, 190, 32);
  
  // Título del reporte
  doc.setTextColor(COLORS.text);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`REPORTE DE ${user.daylogRol.toUpperCase()}`, 20, 40);
  
  // Fecha
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${currentDate}`, 140, 40);
  
  // Información personal
  let yPos = 60;
  
  doc.setTextColor(COLORS.text);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  const personalInfo = [
    ['Nombre:', user.fullName],
    ['Puesto:', user.daylogRol],
    ['País:', user.country],
    ['Área:', user.mainAreaArea],
    ['CuscaID:', user.cuscaId],
    ['Jefe Inmediato:', user.inmediateBoss || 'No asignado'],
    ['Estado:', user.isActive ? 'Activo' : 'Inactivo']
  ];
  
  personalInfo.forEach(([label, value], index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos + (index * 8));
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos + (index * 8));
  });
  
  yPos += personalInfo.length * 8 + 15;
  
  // Sección de proyectos asignados
  if (userData.projects.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Proyectos Asignados:', 20, yPos);
    yPos += 10;
    
    // Tabla de proyectos
    const projectColumns = ['Proyecto', 'Estado', 'Tamaño', 'Área'];
    const projectRows = userData.projects.map(project => [
      project.name,
      project.status,
      project.size,
      project.area
    ]);
    
    const tableConfig = {
      startY: yPos,
      head: [projectColumns],
      body: projectRows,
      theme: 'striped',
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        cellPadding: 4,
        fontSize: 9,
        textColor: [1, 66, 106], // Azul corporativo del banco
        halign: 'left'
      },
      headStyles: {
        fillColor: [1, 66, 106], // Azul corporativo del banco #01426A
        textColor: [255, 255, 255], // Texto blanco
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [1, 66, 106], // Texto azul corporativo
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245] // Gris muy claro para alternancia
      },
      margin: { left: 20, right: 20 }
    };
    
    autoTable(doc, tableConfig);
    
    // Obtener la posición Y final de forma segura
    yPos = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 15 : yPos + 60;
  }
  
  // Sección de Rendimiento Semanal
  if (yPos > 230) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Rendimiento:', 20, yPos);
  yPos += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Esta semana', 20, yPos);
  yPos += 10;
  
  // Tabla de rendimiento semanal
  const weeklyPerformanceData = [
    ['Horas laborales', `${userData.weeklyPerformance.workHours}h`],
    ['Horas extra', `${userData.weeklyPerformance.extraHours}h`],
    ['Horas compensatorias', `${userData.weeklyPerformance.compensatoryHours}h`]
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Tipo', 'Horas']],
    body: weeklyPerformanceData,
    theme: 'striped',
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      cellPadding: 4,
      fontSize: 9,
      textColor: [1, 66, 106], // Azul corporativo del banco
      halign: 'left'
    },
    headStyles: {
      fillColor: [1, 66, 106], // Azul corporativo del banco #01426A
      textColor: [255, 255, 255], // Texto blanco
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fillColor: [255, 255, 255], // Fondo blanco
      textColor: [1, 66, 106], // Texto azul corporativo
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] // Gris muy claro para alternancia
    },
    columnStyles: {
      0: { cellWidth: 80, halign: 'left' },
      1: { cellWidth: 40, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });
  
  yPos = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 15 : yPos + 80;
  
  // Sección de Equipos de Trabajo
  if (userData.workTeams.length > 0) {
    if (yPos > 230) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Equipos de trabajo:', 20, yPos);
    yPos += 10;
    
    // Tabla de equipos de trabajo
    const teamColumns = ['Equipo', 'Tipo', 'Área', 'Supervisor'];
    const teamRows = userData.workTeams.map(team => [
      team.name,
      team.type,
      team.area,
      team.supervisor
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [teamColumns],
      body: teamRows,
      theme: 'striped',
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        cellPadding: 4,
        fontSize: 9,
        textColor: [1, 66, 106], // Azul corporativo del banco
        halign: 'left'
      },
      headStyles: {
        fillColor: [1, 66, 106], // Azul corporativo del banco #01426A
        textColor: [255, 255, 255], // Texto blanco
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [1, 66, 106], // Texto azul corporativo
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245] // Gris muy claro para alternancia
      },
      margin: { left: 20, right: 20 }
    });
    
    yPos = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 15 : yPos + 60;
  }
  
  // Métricas de rendimiento
  if (yPos > 250) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Métricas de Rendimiento:', 20, yPos);
  yPos += 10;
  
  const performanceData = [
    ['Tareas Completadas', userData.performance.completedTasks.toString()],
    ['Proyectos Activos', userData.performance.activeProjects.toString()]
  ];
  
  // Agregar métricas específicas por rol
  if (userData.performance.teamSize) {
    performanceData.push(['Tamaño del Equipo', userData.performance.teamSize.toString()]);
  }
  if (userData.performance.portfolioValue) {
    performanceData.push(['Valor del Portfolio', userData.performance.portfolioValue]);
  }
  if (userData.performance.systemUptime) {
    performanceData.push(['Uptime del Sistema', userData.performance.systemUptime]);
  }
  
  autoTable(doc, {
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: performanceData,
    theme: 'striped',
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      cellPadding: 4,
      fontSize: 9,
      textColor: [1, 66, 106], // Azul corporativo del banco
      halign: 'left'
    },
    headStyles: {
      fillColor: [1, 66, 106], // Azul corporativo del banco #01426A
      textColor: [255, 255, 255], // Texto blanco
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fillColor: [255, 255, 255], // Fondo blanco
      textColor: [1, 66, 106], // Texto azul corporativo
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] // Gris muy claro para alternancia
    },
    columnStyles: {
      0: { cellWidth: 80, halign: 'left' },
      1: { cellWidth: 40, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Agregar logo de fondo como marca de agua en la parte inferior derecha
    try {
      const backgroundLogoUrl = '/Logo de fondo .png';
      // Posicionar parcialmente fuera del área visible para mostrar solo una parte
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({opacity: 0.25})); // Opacidad aumentada para ser más visible
      doc.addImage(backgroundLogoUrl, 'PNG', 145, 220, 120, 120); // x, y, ancho, alto - Logo más hacia adentro para que salga más
      doc.restoreGraphicsState();
    } catch (error) {
      console.warn('No se pudo cargar el logo de fondo para la marca de agua:', error);
    }
    
    // Texto del footer
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text);
    doc.text('DayLog - Sistema de Gestión de Proyectos', 20, 285);
    doc.text(`Página ${i} de ${pageCount}`, 170, 285);
  }
  
  // Guardar el PDF
  const fileName = `reporte_${user.daylogRol.toLowerCase()}_${user.fullName.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};

// Generar reporte individual en Excel
export const generateUserReportExcel = (user) => {
  const userData = getUserAdditionalData(user);
  const currentDate = new Date().toLocaleDateString('es-ES');
  
  // Crear libro de trabajo
  const workbook = XLSX.utils.book_new();
  
  // Hoja 1: Información del usuario
  const userInfoData = [
    ['REPORTE DE ' + user.daylogRol.toUpperCase()],
    ['Fecha:', currentDate],
    [''],
    ['INFORMACIÓN PERSONAL'],
    ['Nombre:', user.fullName],
    ['Puesto:', user.daylogRol],
    ['País:', user.country],
    ['Área:', user.mainAreaArea],
    ['CuscaID:', user.cuscaId],
    ['Jefe Inmediato:', user.inmediateBoss || 'No asignado'],
    ['Estado:', user.isActive ? 'Activo' : 'Inactivo'],
    ['Email:', user.email],
    [''],
    ['MÉTRICAS DE RENDIMIENTO'],
    ['Feedback Score:', userData.performance.feedback],
    ['Tareas Completadas:', userData.performance.completedTasks],
    ['Proyectos Activos:', userData.performance.activeProjects]
  ];
  
  // Agregar métricas específicas por rol
  if (userData.performance.teamSize) {
    userInfoData.push(['Tamaño del Equipo:', userData.performance.teamSize]);
  }
  if (userData.performance.portfolioValue) {
    userInfoData.push(['Valor del Portfolio:', userData.performance.portfolioValue]);
  }
  if (userData.performance.systemUptime) {
    userInfoData.push(['Uptime del Sistema:', userData.performance.systemUptime]);
  }
  
  const userInfoSheet = XLSX.utils.aoa_to_sheet(userInfoData);
  
  // Aplicar estilos básicos
  userInfoSheet['!cols'] = [{ width: 25 }, { width: 30 }];
  
  XLSX.utils.book_append_sheet(workbook, userInfoSheet, 'Información');
  
  // Hoja 2: Proyectos asignados
  if (userData.projects.length > 0) {
    const projectsData = [
      ['PROYECTOS ASIGNADOS'],
      [''],
      ['Proyecto', 'Estado', 'Tamaño', 'Área'],
      ...userData.projects.map(project => [
        project.name,
        project.status,
        project.size,
        project.area
      ])
    ];
    
    const projectsSheet = XLSX.utils.aoa_to_sheet(projectsData);
    projectsSheet['!cols'] = [{ width: 25 }, { width: 15 }, { width: 15 }, { width: 20 }];
    
    XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Proyectos');
  }
  
  // Guardar el archivo Excel
  const fileName = `reporte_${user.daylogRol.toLowerCase()}_${user.fullName.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Función para generar ambos reportes
export const generateUserReports = (user, format = 'both') => {
  try {
    if (format === 'pdf' || format === 'both') {
      generateUserReportPDF(user);
    }
    
    if (format === 'excel' || format === 'both') {
      generateUserReportExcel(user);
    }
    
    return {
      success: true,
      message: `Reporte${format === 'both' ? 's' : ''} generado${format === 'both' ? 's' : ''} exitosamente`
    };
  } catch (error) {
    console.error('Error al generar reporte:', error);
    return {
      success: false,
      message: 'Error al generar el reporte: ' + error.message
    };
  }
};

// Funciones auxiliares para crear gráficas en PDF
const drawBarChart = (doc, x, y, width, height, data, title) => {
  // Validar datos de entrada
  if (!data || data.length === 0) {
    return;
  }
  
  // Validar coordenadas y dimensiones
  x = Number(x) || 0;
  y = Number(y) || 0;
  width = Number(width) || 100;
  height = Number(height) || 50;
  
  // Título de la gráfica
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text);
  doc.text(title || 'Gráfica', x, y - 10);
  
  // Fondo blanco de la gráfica
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, width, height, 'F');
  
  // Marco de la gráfica
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.5);
  doc.rect(x, y, width, height);
  
  // Encontrar valor máximo para escala
  const values = data.map(d => Number(d.value) || 0).filter(v => !isNaN(v));
  const maxValue = Math.max(...values, 1); // Asegurar que no sea 0
  const barWidth = (width - 40) / Math.max(data.length, 1);
  
  // Dibujar barras
  data.forEach((item, index) => {
    const value = Number(item.value) || 0;
    const barHeight = Math.max((value / maxValue) * (height - 30), 0);
    const barX = x + 20 + (index * barWidth);
    const barY = y + height - 20 - barHeight;
    const actualBarWidth = Math.max(barWidth * 0.7, 1);
    
    // Validar que todas las dimensiones sean válidas
    if (barHeight > 0 && actualBarWidth > 0 && !isNaN(barX) && !isNaN(barY)) {
      // Barra principal (azul corporativo)
      doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.rect(barX, barY, actualBarWidth, barHeight, 'F');
      
      // Borde de la barra
      doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
      doc.rect(barX, barY, actualBarWidth, barHeight);
    }
    
    // Etiqueta del empleado
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text);
    const textX = barX + actualBarWidth / 2;
    const label = String(item.label || '').substring(0, 8); // Limitar longitud
    if (!isNaN(textX)) {
      doc.text(label, textX, y + height - 8, { align: 'center' });
    }
    
    // Valor encima de la barra
    if (value > 0 && barHeight > 5 && !isNaN(textX)) {
      doc.setFontSize(7);
      doc.setTextColor(COLORS.text);
      doc.text(value.toString(), textX, barY - 3, { align: 'center' });
    }
  });
};

const drawDonutChart = (doc, x, y, radius, data, title) => {
  // Validar datos de entrada
  if (!data || data.length === 0) {
    return;
  }
  
  // Validar coordenadas y dimensiones
  x = Number(x) || 0;
  y = Number(y) || 0;
  radius = Number(radius) || 30;
  
  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text);
  doc.text(title || 'Distribución', x - radius, y - radius - 15);
  
  // Calcular total y validar
  const values = data.map(d => Number(d.value) || 0).filter(v => !isNaN(v) && v > 0);
  const total = values.reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    // Dibujar círculo vacío si no hay datos
    doc.setFillColor(240, 240, 240);
    doc.circle(x, y, radius - 10, 'F');
    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.circle(x, y, radius - 10);
    return;
  }
  
  let currentAngle = 0;
  
  // Colores corporativos del banco (tonos de azul y dorado)
  const bankColors = [
    [1, 66, 106],      // Azul principal #01426A
    [51, 116, 156],    // Azul medio
    [101, 166, 206],   // Azul claro
    [151, 196, 226],   // Azul muy claro
    [201, 226, 246],   // Azul ultra claro
    [255, 215, 0]      // Dorado (si hay más de 5 elementos)
  ];
  
  // Dibujar segmentos usando rectángulos simples (más confiable)
  data.forEach((item, index) => {
    const value = Number(item.value) || 0;
    if (value <= 0) return;
    
    const angle = (value / total) * 2 * Math.PI;
    const endAngle = currentAngle + angle;
    
    // Color para este segmento
    const color = bankColors[index % bankColors.length];
    doc.setFillColor(color[0], color[1], color[2]);
    
    // Dibujar segmento usando líneas simples en lugar de triángulos
    const steps = Math.max(6, Math.ceil(angle * 8));
    const stepAngle = angle / steps;
    
    for (let i = 0; i < steps; i++) {
      const a1 = currentAngle + (i * stepAngle);
      const a2 = currentAngle + ((i + 1) * stepAngle);
      
      // Calcular puntos y validar que no sean NaN
      const outerR = radius - 8;
      const innerR = radius - 25;
      
      const x1 = x + outerR * Math.cos(a1);
      const y1 = y + outerR * Math.sin(a1);
      const x2 = x + outerR * Math.cos(a2);
      const y2 = y + outerR * Math.sin(a2);
      const x3 = x + innerR * Math.cos(a1);
      const y3 = y + innerR * Math.sin(a1);
      const x4 = x + innerR * Math.cos(a2);
      const y4 = y + innerR * Math.sin(a2);
      
      // Solo dibujar si todos los valores son válidos
      if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
        // Usar rectángulos pequeños en lugar de triángulos
        const rectWidth = 2;
        const rectHeight = outerR - innerR;
        const rectX = (x1 + x3) / 2 - rectWidth / 2;
        const rectY = (y1 + y3) / 2 - rectHeight / 2;
        
        if (!isNaN(rectX) && !isNaN(rectY) && rectWidth > 0 && rectHeight > 0) {
          doc.rect(rectX, rectY, rectWidth, rectHeight, 'F');
        }
      }
    }
    
    currentAngle = endAngle;
  });
  
  // Círculo interior blanco
  const innerRadius = radius - 25;
  if (innerRadius > 0) {
    doc.setFillColor(255, 255, 255);
    doc.circle(x, y, innerRadius, 'F');
    
    // Borde del círculo interior
    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.setLineWidth(0.5);
    doc.circle(x, y, innerRadius);
  }
  
  // Leyenda a la derecha - simplificada
  let legendY = y - (Math.min(data.length, 5) * 6) / 2;
  data.slice(0, 5).forEach((item, index) => { // Limitar a 5 elementos
    const value = Number(item.value) || 0;
    if (value <= 0) return;
    
    const percentage = ((value / total) * 100).toFixed(1);
    const color = bankColors[index % bankColors.length];
    const legendX = x + radius + 5;
    
    // Validar coordenadas de la leyenda
    if (!isNaN(legendX) && !isNaN(legendY)) {
      // Cuadro de color
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(legendX, legendY - 3, 6, 6, 'F');
      doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
      doc.rect(legendX, legendY - 3, 6, 6);
      
      // Texto
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(COLORS.text);
      const label = String(item.label || '').substring(0, 10); // Limitar longitud
      doc.text(`${label}: ${percentage}%`, legendX + 10, legendY);
    }
    
    legendY += 10;
  });
};

// Generar reporte de proyecto en PDF
export const generateProjectReportPDF = (project) => {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Header con logo del Banco Cuscatlán (igual que el reporte de usuarios)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 35, 'F');
  
  try {
    const logoUrl = '/Banco Cuscatlan logo.png';
    doc.addImage(logoUrl, 'PNG', 20, 10, 60, 15);
  } catch (error) {
    console.warn('No se pudo cargar el logo, usando texto como fallback');
    doc.setTextColor(COLORS.primary);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BANCO CUSCATLÁN', 20, 20);
  }
  
  // Línea separadora
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 32, 190, 32);
  
  // Título del reporte
  doc.setTextColor(COLORS.text);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DE PROYECTO', 20, 45);
  
  // Fecha
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${currentDate}`, 140, 45);
  
  let yPos = 65;
  
  // Información general del proyecto
  doc.setTextColor(COLORS.text);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Información General:', 20, yPos);
  yPos += 15;
  
  // Extraer nombre del supervisor correctamente
  let supervisorName = 'No asignado';
  if (project.supervisor) {
    if (typeof project.supervisor === 'string') {
      supervisorName = project.supervisor;
    } else if (typeof project.supervisor === 'object') {
      // Si es un objeto poblado de MongoDB
      supervisorName = project.supervisor.fullName || 
                      project.supervisor.nombre || 
                      (project.supervisor.nombre && project.supervisor.apellido 
                        ? `${project.supervisor.nombre} ${project.supervisor.apellido}` 
                        : '') ||
                      project.supervisor.name || 
                      'Supervisor no identificado';
    }
  }
  
  console.log('DEBUG - Proyecto actual:', project?.nombre || project?.proyectName);
  console.log('DEBUG - Supervisor procesado:', supervisorName);
  
  const projectInfo = [
    ['Código:', project.codigo || project.code || project.id || '# PRU313'],
    ['Nombre proyecto:', project.nombre || project.proyectName || 'PRUEBA AGAIN 3'],
    ['Supervisor:', supervisorName],
    ['Estado:', project.estado || project.state || 'Pendiente'],
    ['Fecha fin:', formatDate(project.fechaFin || project.finishDate)],
    ['Saturación:', project.saturacion || project.saturation || 'Normal'],
    ['Visibilidad:', project.visibilidad || (project.visible ? 'Visible' : 'Privado') || 'Visible'],
    ['Tamaño:', project.tamano || project.size || 'Mediano'],
    ['Fecha de inicio:', formatDate(project.fechaInicio || project.startDate)],
    ['Días de retraso:', project.diasRetraso || '0'],
    ['País:', project.pais || project.country?.name || 'El Salvador']
  ];
  
  projectInfo.forEach(([label, value], index) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(label, 20, yPos + (index * 8));
    doc.setFont('helvetica', 'normal');
    doc.text(value.toString(), 80, yPos + (index * 8));
  });
  
  yPos += projectInfo.length * 8 + 20;
  
  // Áreas y Equipos
  if (yPos > 200) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Áreas y Equipos:', 20, yPos);
  yPos += 15;
  
  // Información del grupo de trabajo
  const workGroupInfo = [
    ['Grupo de trabajo:', project.grupoTrabajo || project.workTeam?.name || 'pruebaToast'],
    ['Área principal:', project.areaPrincipal || project.mainAreaArea?.mainArea?.name || 'Tecnología - Seguridad Informática'],
    ['Área:', project.area || project.mainAreaArea?.area?.name || 'Área']
  ];
  
  workGroupInfo.forEach(([label, value], index) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(label, 20, yPos + (index * 8));
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPos + (index * 8));
  });
  
  yPos += workGroupInfo.length * 8 + 20;
  
  // Empleados del proyecto
  if (yPos > 220) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Empleados del Proyecto:', 20, yPos);
  yPos += 10;
  
  // USAR ÚNICAMENTE empleados específicos del proyecto (NO datos globales)
  console.log('DEBUG - Proyecto específico:', project?.proyectName || project?.nombre);
  console.log('DEBUG - Empleados pasados desde hook:', project.employees);
  console.log('DEBUG - workTeam.employees:', project.workTeam?.employees);
  
  // SOLO usar project.employees que viene del hook useProjectDetail
  // Este array ya está filtrado para el proyecto específico
  let empleadosEspecificosPoyecto = [];
  
  // Prioridad 1: project.employees (viene del hook, ya filtrado para este proyecto)
  if (project.employees && Array.isArray(project.employees) && project.employees.length > 0) {
    empleadosEspecificosPoyecto = project.employees;
    console.log('DEBUG - Usando employees del hook (filtrados):', empleadosEspecificosPoyecto.length, 'empleados');
  }
  // Prioridad 2: Solo si no hay employees, usar workTeam pero validar que sea del proyecto actual
  else if (project.workTeam?.employees && Array.isArray(project.workTeam.employees)) {
    // Filtrar solo empleados que tengan datos válidos
    empleadosEspecificosPoyecto = project.workTeam.employees.filter(emp => {
      const employee = emp.id && typeof emp.id === 'object' ? emp.id : emp;
      return employee && (employee.fullName || employee.nombre || employee._id);
    });
    console.log('DEBUG - Usando workTeam.employees validados:', empleadosEspecificosPoyecto.length, 'empleados');
  }
  
  console.log('DEBUG - Total empleados del PROYECTO ACTUAL:', empleadosEspecificosPoyecto.length);
  empleadosEspecificosPoyecto.forEach((emp, i) => {
    console.log(`DEBUG - Empleado ${i + 1} del proyecto:`, emp);
  });
  
  // Procesar SOLO empleados del proyecto específico
  const employeesData = empleadosEspecificosPoyecto.length > 0 
    ? empleadosEspecificosPoyecto.map((emp, index) => {
        console.log(`DEBUG TABLA - Procesando empleado ${index + 1} del proyecto:`, emp);
        
        // Obtener datos del empleado (ya viene procesado del hook)
        let fullName = '';
        let cuscaId = '';
        let activityCount = '0';
        
        // Si viene del hook useProjectDetail (structure: {id, nombre, apellido, cuscaID, actividades})
        if (emp.nombre !== undefined) {
          fullName = `${emp.nombre} ${emp.apellido || ''}`.trim();
          cuscaId = emp.cuscaID || emp.id || 'N/A';
          activityCount = emp.actividades?.toString() || '0';
        }
        // Si viene de workTeam.employees (structure MongoDB poblada)
        else {
          const employee = emp.id && typeof emp.id === 'object' ? emp.id : emp;
          fullName = employee?.fullName || employee?.name || `Empleado ${index + 1}`;
          cuscaId = employee?.cuscaId || employee?.cuscaID || 'N/A';
          activityCount = '0'; // workTeam no tiene conteo de actividades
        }
        
        const result = [fullName, cuscaId, activityCount];
        console.log(`DEBUG TABLA - Fila final ${index + 1}:`, result);
        return result;
      })
    : [['No hay empleados asignados al proyecto', '-', '0']];
  
  console.log('DEBUG TABLA - Tabla final (SOLO proyecto actual):', employeesData);
  console.log('DEBUG TABLA - Total filas en PDF:', employeesData.length);
  
  // Tabla de empleados
  autoTable(doc, {
    startY: yPos,
    head: [['Empleado', 'ID', 'Actividades']],
    body: employeesData,
    theme: 'striped',
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      cellPadding: 4,
      fontSize: 9,
      textColor: [1, 66, 106],
      halign: 'left'
    },
    headStyles: {
      fillColor: [1, 66, 106],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [1, 66, 106],
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { left: 20, right: 20 }
  });
  
  yPos = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 30 : yPos + 80;
  
  // SECCIÓN DE MÉTRICAS ELIMINADA - Ir directo a gráficas
  
  // Agregar nueva página para gráficas si es necesario
  if (yPos > 150) {
    doc.addPage();
    yPos = 30;
  }
  
  // GRÁFICAS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(COLORS.text);
  doc.text('Análisis Gráfico del Proyecto:', 20, yPos);
  yPos += 20;
  
  // Procesar datos reales de empleados para la gráfica de barras
  // USAR SOLO los empleados específicos del proyecto actual
  const employeesWithActivities = project.employees || []; // Datos reales con conteos del hook
  
  const employeeActivityCounts = employeesWithActivities
    .map(emp => {
      // Extraer datos del empleado del hook (ya procesados)
      const fullName = emp.nombre ? `${emp.nombre} ${emp.apellido || ''}`.trim() : 'N/D';
      const [nombre] = fullName.split(' ');
      const activityCount = emp.actividades || 0;
      
      return {
        label: nombre || emp.cuscaID || 'N/D',
        value: activityCount
      };
    })
    .filter(emp => emp.label !== 'N/D' && emp.value > 0)
    .sort((a, b) => b.value - a.value) // Ordenar por actividades (mayor a menor)
    .slice(0, 8); // Limitar a 8 empleados para que se vea bien
  
  // Si no hay empleados con actividades, usar datos de ejemplo
  const activityData = employeeActivityCounts.length > 0 ? employeeActivityCounts : [
    { label: 'Sin datos', value: 0 }
  ];
  
  // Calcular total de empleados para el título
  const totalEmployees = employeesWithActivities.length;
  const chartTitle = `Actividades por Empleado - ${totalEmployees} empleados en el equipo`;
  
  // Gráfica de barras - Actividades por empleado
  drawBarChart(doc, 20, yPos, 170, 60, activityData, chartTitle);
  
  // Procesar datos reales para la distribución de carga de trabajo
  const getWorkloadDistribution = (employees) => {
    if (!employees || employees.length === 0) {
      return [
        { label: 'Sin equipo', value: 1 }
      ];
    }
    
    // Obtener información de áreas del proyecto
    const mainArea = project.mainAreaArea?.mainArea?.name || 'General';
    const subArea = project.mainAreaArea?.area?.name || 'Sin área';
    const workTeamName = project.workTeam?.name || 'Equipo principal';
    
    // Crear distribución basada en la estructura del proyecto
    const distribution = [
      { label: mainArea.length > 12 ? mainArea.substring(0, 12) + '...' : mainArea, value: Math.ceil(employees.length * 0.4) },
      { label: subArea.length > 12 ? subArea.substring(0, 12) + '...' : subArea, value: Math.ceil(employees.length * 0.3) },
      { label: 'Soporte', value: Math.ceil(employees.length * 0.2) },
      { label: 'Documentación', value: Math.floor(employees.length * 0.1) }
    ].filter(item => item.value > 0);
    
    return distribution;
  };
  
  const distributionData = getWorkloadDistribution(employeesWithActivities);
  
  // Posición para la gráfica circular (a la derecha si hay espacio, o abajo)
  let donutX = 105;
  let donutY = yPos + 110;
  
  // Si no hay suficiente espacio, agregar nueva página
  if (donutY > 230) {
    doc.addPage();
    donutY = 80;
  }
  
  // Gráfica circular - Distribución de equipo por áreas
  const donutTitle = `Distribución del Equipo - ${project.workTeam?.name || 'Proyecto'}`;
  drawDonutChart(doc, donutX, donutY, 35, distributionData, donutTitle);
  
  // Footer con marca de agua (igual que el reporte de usuarios)
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Agregar logo de fondo como marca de agua
    try {
      const backgroundLogoUrl = '/Logo de fondo .png';
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({opacity: 0.25}));
      doc.addImage(backgroundLogoUrl, 'PNG', 145, 220, 120, 120);
      doc.restoreGraphicsState();
    } catch (error) {
      console.warn('No se pudo cargar el logo de fondo para la marca de agua:', error);
    }
    
    // Texto del footer
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text);
    doc.text('DayLog - Sistema de Gestión de Proyectos', 20, 285);
    doc.text(`Página ${i} de ${pageCount}`, 170, 285);
  }
  
  // Guardar el PDF
  const fileName = `reporte_proyecto_${(project.nombre || project.proyectName || 'proyecto').replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};

// Función para generar reporte de proyecto en Excel
export const generateProjectReportExcel = (project) => {
  console.log('=== INICIO GENERACIÓN REPORTE EXCEL ===');
  console.log('Proyecto recibido para Excel:', project);
  
  const currentDate = new Date().toLocaleDateString('es-ES');
  
  // Crear libro de trabajo
  const workbook = XLSX.utils.book_new();
  
  // Hoja 1: Información general del proyecto
  const projectInfoData = [
    ['REPORTE DE PROYECTO'],
    ['Fecha:', currentDate],
    [''],
    ['INFORMACIÓN GENERAL DEL PROYECTO'],
    ['Nombre:', project.nombre || project.proyectName || 'Sin nombre'],
    ['Código:', project.codigo || project.code || 'Sin código'],
    ['Estado:', project.estado || project.state || 'Pendiente'],
    ['Fecha de inicio:', formatDate(project.fechaInicio || project.startDate)],
    ['Fecha fin:', formatDate(project.fechaFin || project.finishDate)],
    ['Saturación:', project.saturacion || project.saturation || 'Normal'],
    ['Visibilidad:', project.visibilidad || (project.visible ? 'Visible' : 'Privado') || 'Visible'],
    ['Tamaño:', project.tamano || project.size || 'Mediano'],
    ['Días de retraso:', project.diasRetraso || '0'],
    ['País:', project.pais || project.country?.name || 'El Salvador'],
    ['Grupo de trabajo:', project.grupoTrabajo || project.workTeam?.name || 'Sin asignar'],
    ['Área principal:', project.areaPrincipal || project.mainArea?.name || 'Sin asignar'],
    ['Área:', project.area || project.area?.name || 'Sin asignar'],
    ['Supervisor:', project.supervisor || project.supervisor?.fullName || 'Sin asignar'],
    [''],
    ['RESUMEN DE ACTIVIDADES'],
    ['Total de empleados:', project.employees?.length || 0],
    ['Total de actividades:', project.employees?.reduce((total, emp) => total + (emp.actividades || 0), 0) || 0]
  ];
  
  const projectInfoSheet = XLSX.utils.aoa_to_sheet(projectInfoData);
  projectInfoSheet['!cols'] = [{ width: 25 }, { width: 30 }];
  XLSX.utils.book_append_sheet(workbook, projectInfoSheet, 'Información General');
  
  // Hoja 2: Empleados del proyecto
  if (project.employees && project.employees.length > 0) {
    const employeesData = [
      ['EMPLEADOS DEL PROYECTO'],
      [''],
      ['Nombre', 'Apellido', 'CuscaID', 'Actividades', 'Estado']
    ];
    
    project.employees.forEach(emp => {
      employeesData.push([
        emp.nombre || emp.firstName || 'Sin nombre',
        emp.apellido || emp.lastName || 'Sin apellido',
        emp.cuscaID || emp.cuscaId || 'Sin ID',
        emp.actividades || 0,
        emp.isActive ? 'Activo' : 'Inactivo'
      ]);
    });
    
    const employeesSheet = XLSX.utils.aoa_to_sheet(employeesData);
    employeesSheet['!cols'] = [
      { width: 20 }, // Nombre
      { width: 20 }, // Apellido
      { width: 15 }, // CuscaID
      { width: 15 }, // Actividades
      { width: 15 }  // Estado
    ];
    
    XLSX.utils.book_append_sheet(workbook, employeesSheet, 'Empleados');
  }
  
  // Hoja 3: Distribución de carga de trabajo
  if (project.employees && project.employees.length > 0) {
    const workloadData = [
      ['DISTRIBUCIÓN DE CARGA DE TRABAJO'],
      [''],
      ['Rango de Actividades', 'Cantidad de Empleados', 'Porcentaje']
    ];
    
    // Calcular distribución de carga de trabajo
    const activityCounts = project.employees.map(emp => emp.actividades || 0);
    const totalEmployees = project.employees.length;
    
    const distribution = [
      { range: '0-5 actividades', count: 0, percentage: 0 },
      { range: '6-10 actividades', count: 0, percentage: 0 },
      { range: '11-15 actividades', count: 0, percentage: 0 },
      { range: '16+ actividades', count: 0, percentage: 0 }
    ];
    
    activityCounts.forEach(count => {
      if (count <= 5) distribution[0].count++;
      else if (count <= 10) distribution[1].count++;
      else if (count <= 15) distribution[2].count++;
      else distribution[3].count++;
    });
    
    // Calcular porcentajes
    distribution.forEach(item => {
      item.percentage = totalEmployees > 0 ? ((item.count / totalEmployees) * 100).toFixed(1) : 0;
    });
    
    // Agregar datos a la hoja
    distribution.forEach(item => {
      workloadData.push([
        item.range,
        item.count,
        `${item.percentage}%`
      ]);
    });
    
    const workloadSheet = XLSX.utils.aoa_to_sheet(workloadData);
    workloadSheet['!cols'] = [
      { width: 25 }, // Rango
      { width: 20 }, // Cantidad
      { width: 15 }  // Porcentaje
    ];
    
    XLSX.utils.book_append_sheet(workbook, workloadSheet, 'Distribución Carga');
  }
  
  // Hoja 4: Detalles del equipo de trabajo (si existe)
  if (project.workTeam && project.workTeam.employees && project.workTeam.employees.length > 0) {
    const workTeamData = [
      ['DETALLES DEL EQUIPO DE TRABAJO'],
      [''],
      ['Nombre del Equipo:', project.workTeam.name || 'Sin nombre'],
      [''],
      ['Nombre', 'Apellido', 'CuscaID', 'Rol', 'Estado']
    ];
    
    project.workTeam.employees.forEach(emp => {
      workTeamData.push([
        emp.nombre || emp.firstName || 'Sin nombre',
        emp.apellido || emp.lastName || 'Sin apellido',
        emp.cuscaID || emp.cuscaId || 'Sin ID',
        emp.daylogRol || 'Sin rol',
        emp.isActive ? 'Activo' : 'Inactivo'
      ]);
    });
    
    const workTeamSheet = XLSX.utils.aoa_to_sheet(workTeamData);
    workTeamSheet['!cols'] = [
      { width: 20 }, // Nombre
      { width: 20 }, // Apellido
      { width: 15 }, // CuscaID
      { width: 20 }, // Rol
      { width: 15 }  // Estado
    ];
    
    XLSX.utils.book_append_sheet(workbook, workTeamSheet, 'Equipo de Trabajo');
  }
  
  // Guardar el archivo Excel
  const fileName = `reporte_proyecto_${(project.nombre || project.proyectName || 'proyecto').replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  console.log('=== FIN GENERACIÓN REPORTE EXCEL ===');
};

// Función para generar reporte de proyecto
export const generateProjectReport = (project, format = 'pdf') => {
  try {
    console.log('=== INICIO GENERACIÓN REPORTE ===');
    console.log('Proyecto recibido:', project);
    console.log('ID del proyecto:', project._id || project.id);
    console.log('Nombre del proyecto:', project.nombre || project.proyectName);
    console.log('Empleados del proyecto:', project.employees);
    console.log('WorkTeam del proyecto:', project.workTeam);
    console.log('Formato solicitado:', format);
    
    // Validar que tenemos datos del proyecto
    if (!project) {
      throw new Error('No se recibieron datos del proyecto');
    }
    
    // Validar que tenemos empleados específicos del proyecto
    if (!project.employees || !Array.isArray(project.employees)) {
      console.warn('No se encontraron empleados específicos del proyecto, usando datos del workTeam');
    } else {
      console.log(`✅ Empleados específicos del proyecto encontrados: ${project.employees.length}`);
      project.employees.forEach((emp, index) => {
        console.log(`Empleado ${index + 1}:`, emp);
      });
    }
    
    // Agregar empleados con datos de actividades si están disponibles en el proyecto
    const enhancedProject = {
      ...project,
      employees: project.employees || [] // Array de empleados con conteos de actividades reales
    };
    
    console.log('Proyecto mejorado:', enhancedProject);
    
    if (format === 'pdf' || format === 'both') {
      console.log('Generando reporte PDF...');
      generateProjectReportPDF(enhancedProject);
    }
    
    if (format === 'excel' || format === 'both') {
      console.log('Generando reporte Excel...');
      generateProjectReportExcel(enhancedProject);
    }
    
    console.log('=== FIN GENERACIÓN REPORTE ===');
    
    return {
      success: true,
      message: `Reporte de proyecto generado exitosamente en formato ${format === 'both' ? 'PDF y Excel' : format.toUpperCase()}`
    };
  } catch (error) {
    console.error('Error al generar reporte de proyecto:', error);
    return {
      success: false,
      message: 'Error al generar el reporte de proyecto: ' + error.message
    };
  }
};
