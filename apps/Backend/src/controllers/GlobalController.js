import ProyectModel from "../models/Project.js";
import EmployeeModel from "../models/Employee.js";
import ActivityModel from "../models/Activity.js";
import MainAreaAreaModel from "../models/MainArea-Area.js";
import CountryModel from "../models/Country.js";

const GlobalController = {};

GlobalController.getGlobalStats = async (req, res) => {
  try {
    // 1. Usuarios totales
    const totalUsers = await EmployeeModel.countDocuments({});

    // 2. Usuarios activos (con lastLogin en la última hora y isActive)
    const recentLoginThreshold = new Date(Date.now() - 60 * 60 * 1000); // Última hora
    const activeUsers = await EmployeeModel.countDocuments({
      isActive: true,
      lastLogin: { $gte: recentLoginThreshold }
    });

    // 3. Proyectos por estado
    const projects = await ProyectModel.find({ eliminated: { $ne: true } })
      .populate('country')
      .populate('mainAreaArea')
      .populate('supervisor');

    const projectStates = {
      pendiente: 0,
      enProceso: 0,
      finalizado: 0,
      cancelado: 0,
      atrasado: 0,
      enRiesgo: 0,
      repriorizado: 0
    };
    const areaFinishedCount = {};
    const countryFinishedCount = {};
    const supervisorStats = {};
    let fastestCountry = null;
    let fastestAvg = null;
    let slowestCountry = null;
    let slowestAvg = null;
    let efficiencyByCountry = {};
    let areaMostFinished = null;
    let areaMostFinishedCount = 0;

    // Para eficiencia
    const countryDurations = {};
    const countryFinishedProjects = {};

    projects.forEach(project => {
      // Estado
      switch (project.state) {
        case 'Pendiente': projectStates.pendiente++; break;
        case 'En proceso': projectStates.enProceso++; break;
        case 'Finalizado': projectStates.finalizado++; break;
        case 'Cancelado': projectStates.cancelado++; break;
        case 'Atrasado': projectStates.atrasado++; break;
        case 'En riesgo': projectStates.enRiesgo++; break;
        case 'Repriorizado': projectStates.repriorizado++; break;
      }
      // Área más sobresaliente (mainAreaArea)
      if (project.state === 'Finalizado' && project.mainAreaArea) {
        // Si está populado, usa el _id, si no, usa el valor directo
        const areaId = project.mainAreaArea._id ? project.mainAreaArea._id.toString() : project.mainAreaArea.toString();
        areaFinishedCount[areaId] = (areaFinishedCount[areaId] || 0) + 1;
        if (areaFinishedCount[areaId] > areaMostFinishedCount) {
          areaMostFinished = areaId;
          areaMostFinishedCount = areaFinishedCount[areaId];
        }
      }
      // País con más proyectos acabados
      if (project.state === 'Finalizado' && project.country) {
        const countryId = project.country._id ? project.country._id.toString() : project.country.toString();
        countryFinishedCount[countryId] = (countryFinishedCount[countryId] || 0) + 1;
      }
      // Supervisor stats
      if (project.supervisor) {
        const supId = project.supervisor._id ? project.supervisor._id.toString() : project.supervisor.toString();
        if (!supervisorStats[supId]) {
          supervisorStats[supId] = { finished: 0, assigned: 0, supervisor: project.supervisor };
        }
        supervisorStats[supId].assigned++;
        if (project.state === 'Finalizado') supervisorStats[supId].finished++;
      }
      // Eficiencia por país (solo proyectos finalizados)
      if (project.state === 'Finalizado' && project.country) {
        const countryId = project.country._id ? project.country._id.toString() : project.country.toString();
        const duration = (new Date(project.finishDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24); // días
        if (!countryDurations[countryId]) countryDurations[countryId] = 0;
        if (!countryFinishedProjects[countryId]) countryFinishedProjects[countryId] = 0;
        countryDurations[countryId] += duration;
        countryFinishedProjects[countryId]++;
      }
    });

    // Empleados por país
    const employees = await EmployeeModel.find({ isActive: true }).populate('country');
    const employeesByCountry = {};
    employees.forEach(emp => {
      const countryId = emp.country?._id ? emp.country._id.toString() : emp.country?.toString();
      if (!countryId) return;
      if (!employeesByCountry[countryId]) employeesByCountry[countryId] = { count: 0, name: emp.country.name };
      employeesByCountry[countryId].count++;
    });

    // Proyectos por país y saturación
    const projectsByCountry = {};
    projects.forEach(project => {
      const countryId = project.country?._id ? project.country._id.toString() : project.country?.toString();
      if (!countryId) return;
      if (!projectsByCountry[countryId]) {
        projectsByCountry[countryId] = {
          name: project.country.name,
          activos: 0,
          pendientes: 0,
          retrasados: 0,
          finalizados: 0
        };
      }
      switch (project.state) {
        case 'Pendiente':
          projectsByCountry[countryId].pendientes++;
          break;
        case 'En proceso':
        case 'En riesgo':
        case 'Atrasado':
        case 'Repriorizado':
          projectsByCountry[countryId].activos++;
          break;
        case 'Finalizado':
          projectsByCountry[countryId].finalizados++;
          break;
        case 'Cancelado':
          // No se cuenta para saturación
          break;
        default:
          break;
      }
      // Considerar retrasados como parte de saturación
      if (project.state === 'Atrasado') {
        projectsByCountry[countryId].retrasados++;
      }
    });
    // Calcular saturación: si la suma de activos+pendientes+retrasados > finalizados, se considera saturado
    Object.values(projectsByCountry).forEach(obj => {
      obj.saturado = (obj.activos + obj.pendientes + obj.retrasados) > obj.finalizados;
    });

    // Obtener nombre de área más sobresaliente
    let areaName = null;
    if (areaMostFinished) {
      const areaDoc = await MainAreaAreaModel.findById(areaMostFinished).populate('mainArea area');
      if (areaDoc) {
        areaName = `${areaDoc.mainArea?.name || ''} - ${areaDoc.area?.name || ''}`;
      }
    }

    // País con más proyectos acabados
    let topCountry = null;
    let topCountryCount = 0;
    for (const [countryId, count] of Object.entries(countryFinishedCount)) {
      if (count > topCountryCount) {
        topCountry = countryId;
        topCountryCount = count;
      }
    }
    let topCountryName = null;
    if (topCountry) {
      const countryDoc = await CountryModel.findById(topCountry);
      topCountryName = countryDoc?.name || null;
    }

    // Eficiencia por país (promedio de días en terminar proyectos)
    for (const [countryId, totalDuration] of Object.entries(countryDurations)) {
      const avg = totalDuration / countryFinishedProjects[countryId];
      efficiencyByCountry[countryId] = avg;
      if (fastestAvg === null || avg < fastestAvg) {
        fastestAvg = avg;
        fastestCountry = countryId;
      }
      if (slowestAvg === null || avg > slowestAvg) {
        slowestAvg = avg;
        slowestCountry = countryId;
      }
    }
    // Formatear eficiencia para frontend
    const efficiency = [];
    for (const [countryId, avg] of Object.entries(efficiencyByCountry)) {
      const countryDoc = await CountryModel.findById(countryId);
      efficiency.push({ country: countryDoc?.name || countryId, avgDays: avg });
    }

    // 4. Empleado con más y menos actividades
    const activityCounts = await ActivityModel.aggregate([
      { $group: { _id: "$employee", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    let topEmployee = null;
    let bottomEmployee = null;
    if (activityCounts.length > 0) {
      const topEmpDoc = await EmployeeModel.findById(activityCounts[0]._id);
      topEmployee = topEmpDoc ? topEmpDoc.fullName : null;
      const bottomEmpDoc = await EmployeeModel.findById(activityCounts[activityCounts.length - 1]._id);
      bottomEmployee = bottomEmpDoc ? bottomEmpDoc.fullName : null;
    }

    // 5. Supervisor sobresaliente
    let topSupervisor = null;
    let topSupervisorStats = null;
    for (const supId in supervisorStats) {
      const stats = supervisorStats[supId];
      if (!topSupervisorStats || (stats.finished > topSupervisorStats.finished || (stats.finished === topSupervisorStats.finished && stats.assigned > topSupervisorStats.assigned))) {
        topSupervisor = stats.supervisor;
        topSupervisorStats = stats;
      }
    }

    res.json({
      totalUsers,
      activeUsers,
      projectStates,
      areaMostFinished: areaName,
      topCountry: topCountryName,
      efficiency,
      topEmployee,
      bottomEmployee,
      topSupervisor: topSupervisor ? {
        name: topSupervisor.fullName,
        finished: topSupervisorStats.finished,
        assigned: topSupervisorStats.assigned
      } : null,
      employeesByCountry,
      projectsByCountry
    });
  } catch (error) {
    console.error("Error en getGlobalStats:", error);
    res.status(500).json({ message: "Error al obtener estadísticas globales", error: error.message });
  }
};

export default GlobalController; 