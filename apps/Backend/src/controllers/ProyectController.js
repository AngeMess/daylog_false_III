


const ProyectController = {};
import ProyectModel from "../models/Project.js";
import WorkTeamModel from "../models/WorkTeam.js";
import EmployeeModel from "../models/Employee.js";

// Método existente getProyect (sin cambios)
ProyectController.getProyect = async(req, res) => {
 try {
   const Proyects = await ProyectModel.find({eliminated: {$ne: true}})
     .populate({
       path: 'workTeam',
       populate: {
         path: 'supervisor employees.id',
         model: 'Employee'
       }
     })
     .populate('supervisor')
     .populate('country')
     .populate('mainAreaArea');
     console.log("estos son mis datos"+Proyects)
   res.status(200).json(Proyects);
 } catch (error) {
   console.error("Error al obtener proyectos:", error);
   res.status(500).json({ message: "Error al obtener proyectos", error: error.message });
 }
}

// NUEVO: Endpoint para estadísticas del dashboard
ProyectController.getDashboardStats = async(req, res) => {
  try {
    // Obtener todos los proyectos no eliminados
    const allProjects = await ProyectModel.find({eliminated: {$ne: true}});
    
    // Contar proyectos por estado
    const projectsByState = {
      activos: 0,
      completados: 0,
      retrasados: 0,
      total: allProjects.length
    };

    const today = new Date();
    // CORRECCIÓN: Resetear las horas para comparaciones de fechas más precisas
    today.setHours(0, 0, 0, 0);
    
    allProjects.forEach(project => {
      const finishDate = new Date(project.finishDate);
      
      // Lógica corregida para clasificar proyectos
      if (project.state === 'Finalizado' || project.state === 'Completado') {
        projectsByState.completados++;
      } else if (project.state === 'En proceso' || project.state === 'Atrasado' || project.state === 'En riesgo' || project.state === 'Repriorizado'  ) {
        projectsByState.activos++;
      } else if (finishDate < today && project.state !== 'Completado' && project.state !== 'Finalizado') {
        projectsByState.retrasados++;
      }
    });

    // CORRECCIÓN: Mejorar la lógica de próximos proyectos
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // DEBUG: Agregar logs para debuggear
    console.log('🔍 DEBUG - Fechas de búsqueda:');
    console.log('Today:', today.toISOString().split('T')[0]);
    console.log('30 days from now:', thirtyDaysFromNow.toISOString().split('T')[0]);

    // Primero buscar TODOS los proyectos con startDate futura para debug
    const allFutureProjects = await ProyectModel.find({
      eliminated: {$ne: true},
      startDate: { $gte: today }
    });

    console.log(`🔍 DEBUG - Total proyectos futuros encontrados: ${allFutureProjects.length}`);
    allFutureProjects.forEach(project => {
      console.log(`- ${project.proyectName}: ${new Date(project.startDate).toISOString().split('T')[0]} (Estado: ${project.state})`);
    });

    // Ahora buscar los próximos 30 días con condiciones más flexibles
    const upcomingProjects = await ProyectModel.find({
      eliminated: {$ne: true},
      startDate: {
        $gte: today,
        $lte: thirtyDaysFromNow
      }
    })
    .populate('supervisor', 'fullName')
    .populate('country', 'name')
    .sort({ startDate: 1 })
    .limit(5);

    console.log(`🔍 DEBUG - Próximos proyectos (30 días): ${upcomingProjects.length}`);

    // ALTERNATIVA: Si no hay proyectos en 30 días, buscar en 90 días
    let alternativeUpcoming = [];
    if (upcomingProjects.length === 0) {
      const ninetyDaysFromNow = new Date(today);
      ninetyDaysFromNow.setDate(today.getDate() + 90);
      
      alternativeUpcoming = await ProyectModel.find({
        eliminated: {$ne: true},
        startDate: {
          $gte: today,
          $lte: ninetyDaysFromNow
        }
      })
      .populate('supervisor', 'fullName')
      .populate('country', 'name')
      .sort({ startDate: 1 })
      .limit(5);
      
      console.log(`🔍 DEBUG - Próximos proyectos (90 días como alternativa): ${alternativeUpcoming.length}`);
    }

    const finalUpcomingProjects = upcomingProjects.length > 0 ? upcomingProjects : alternativeUpcoming;

    // Formatear próximos proyectos
    const formattedUpcomingProjects = finalUpcomingProjects.map(project => {
      const projectStartDate = new Date(project.startDate);
      const daysUntilStart = Math.ceil((projectStartDate - today) / (1000 * 60 * 60 * 24));
      
      return {
        id: project._id,
        name: project.proyectName,
        startDate: project.startDate,
        supervisor: project.supervisor?.fullName || 'Sin asignar',
        country: project.country?.name || 'Sin país',
        state: project.state,
        daysUntilStart: daysUntilStart
      };
    });

    console.log(`📊 Estadísticas del dashboard generadas:`, projectsByState);
    console.log(`📅 Próximos proyectos finales: ${formattedUpcomingProjects.length}`);

    res.status(200).json({
      projectsByState,
      upcomingProjects: formattedUpcomingProjects,
      message: "Estadísticas del dashboard obtenidas exitosamente",
      // DEBUG: Incluir info adicional para debug
      debug: {
        totalFutureProjects: allFutureProjects.length,
        searchDates: {
          today: today.toISOString().split('T')[0],
          thirtyDaysFromNow: thirtyDaysFromNow.toISOString().split('T')[0]
        }
      }
    });

  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error);
    res.status(500).json({ 
      message: "Error al obtener estadísticas del dashboard", 
      error: error.message,
      projectsByState: { activos: 0, completados: 0, retrasados: 0, total: 0 },
      upcomingProjects: []
    });
  }
}
// NUEVO: Endpoint para ranking de supervisores
ProyectController.getSupervisorStats = async(req, res) => {
 try {
   // Aggregate para contar proyectos por supervisor
   const supervisorStats = await ProyectModel.aggregate([
     // Solo proyectos no eliminados
     { $match: { eliminated: { $ne: true } } },
     
     // Agrupar por supervisor
     {
       $group: {
         _id: "$supervisor",
         projectCount: { $sum: 1 },
         activeProjects: {
           $sum: {
             $cond: [
               { $in: ["$state", ["En proceso", "Activo"]] },
               1,
               0
             ]
           }
         },
         completedProjects: {
           $sum: {
             $cond: [
               { $in: ["$state", ["Finalizado", "Finalizado"]] },
               1,
               0
             ]
           }
         }
       }
     },
     
     // Ordenar por cantidad de proyectos (descendente)
     { $sort: { projectCount: -1 } },
     
     // Limitar a top 10
     { $limit: 10 }
   ]);

   // Populate información del supervisor
   const populatedStats = await ProyectModel.populate(supervisorStats, {
     path: '_id',
     select: 'fullName cuscaId daylogRol',
     model: 'Employee'
   });

   // Formatear datos para el frontend
   const formattedSupervisorStats = populatedStats
     .filter(stat => stat._id) // Filtrar supervisores nulos
     .map((stat, index) => ({
       rank: index + 1,
       id: stat._id._id,
       name: stat._id.fullName,
       cuscaId: stat._id.cuscaId,
       role: stat._id.daylogRol,
       totalProjects: stat.projectCount,
       activeProjects: stat.activeProjects,
       completedProjects: stat.completedProjects
     }));

   console.log(`👨‍💼 Estadísticas de supervisores generadas: ${formattedSupervisorStats.length} supervisores`);

   res.status(200).json({
     supervisors: formattedSupervisorStats,
     message: "Estadísticas de supervisores obtenidas exitosamente"
   });

 } catch (error) {
   console.error("Error al obtener estadísticas de supervisores:", error);
   res.status(500).json({ 
     message: "Error al obtener estadísticas de supervisores", 
     error: error.message,
     supervisors: []
   });
 }
}

// NUEVO: Endpoint para datos de gráfica (proyectos por mes)
ProyectController.getProjectsChartData = async(req, res) => {
 try {
   const currentYear = new Date().getFullYear();
   
   // Obtener proyectos del año actual
   const projectsThisYear = await ProyectModel.find({
     eliminated: {$ne: true},
     $or: [
       { 
         startDate: {
           $gte: new Date(`${currentYear}-01-01`),
           $lte: new Date(`${currentYear}-12-31`)
         }
       },
       {
         finishDate: {
           $gte: new Date(`${currentYear}-01-01`),
           $lte: new Date(`${currentYear}-12-31`)
         }
       }
     ]
   });

   // Inicializar contadores por mes
   const monthlyData = Array.from({length: 12}, (_, i) => ({
     month: new Date(2024, i).toLocaleString('es', { month: 'short' }),
     iniciados: 0,
     finalizados: 0
   }));

   // Contar proyectos iniciados y finalizados por mes
   projectsThisYear.forEach(project => {
     if (project.startDate) {
       const startMonth = new Date(project.startDate).getMonth();
       if (new Date(project.startDate).getFullYear() === currentYear) {
         monthlyData[startMonth].iniciados++;
       }
     }

     if (project.finishDate && (project.state === 'Finalizado' || project.state === 'Finalizado')) {
       const finishMonth = new Date(project.finishDate).getMonth();
       if (new Date(project.finishDate).getFullYear() === currentYear) {
         monthlyData[finishMonth].finalizados++;
       }
     }
   });

   console.log(`📈 Datos de gráfica generados para el año ${currentYear}`);

   res.status(200).json({
     chartData: monthlyData,
     year: currentYear,
     message: "Datos de gráfica obtenidos exitosamente"
   });

 } catch (error) {
   console.error("Error al obtener datos de gráfica:", error);
   res.status(500).json({ 
     message: "Error al obtener datos de gráfica", 
     error: error.message,
     chartData: []
   });
 }
}

// Métodos existentes (sin cambios)
ProyectController.getProyectById = async(req, res) => {
 try {
   const proyect = await ProyectModel.findById(req.params.id)
     .populate({
       path: 'workTeam',
       populate: {
         path: 'supervisor employees.id',
         model: 'Employee'
       }
     })
     .populate('supervisor')
     .populate('country')
     .populate({
       path: 'mainAreaArea',
       populate: [
         { path: 'mainArea' },
         { path: 'area' }
       ]
     });
   
   if (!proyect) {
     return res.status(404).json({ message: "Proyecto no encontrado" });
   }
   
   res.status(200).json(proyect);
 } catch (error) {
   console.error("Error al obtener proyecto por ID:", error);
   res.status(500).json({ message: "Error al obtener el proyecto", error: error.message });
 }
}

ProyectController.insertProyect = async(req,res) => {    
 try {
   console.log('Datos recibidos en el backend:', req.body);
   console.log('🔍 Verificación de campos requeridos:', {
     code: !!req.body.code,
     proyectName: !!req.body.proyectName,
     startDate: !!req.body.startDate,
     finishDate: !!req.body.finishDate,
     size: !!req.body.size,
     state: !!req.body.state,
     workTeam: !!req.body.workTeam,
     country: !!req.body.country,
     saturation: !!req.body.saturation
   });
   
   const {
     code, 
     proyectName, 
     startDate, 
     finishDate, 
     size, 
     state, 
     workTeam, 
     country,
     visible, 
     eliminated, 
     saturation, 
     mainAreaArea,
     supervisor,
     visibility
   } = req.body;

   if (!finishDate) {
     console.error('Error: finishDate es requerido pero no fue enviado');
     return res.status(400).json({ message: "La fecha de fin (finishDate) es obligatoria" });
   }

   if (!country) {
     console.error('Error: country es requerido pero no fue enviado');
     return res.status(400).json({ message: "El país (country) es obligatorio" });
   }

   if (!workTeam) {
     console.error('Error: workTeam es requerido pero no fue enviado');
     return res.status(400).json({ message: "El equipo de trabajo (workTeam) es obligatorio" });
   }

   if (workTeam) {
     const workTeamExists = await WorkTeamModel.findById(workTeam);
     if (!workTeamExists) {
       return res.status(400).json({ message: "El equipo de trabajo especificado no existe" });
     }
   }

   if (supervisor) {
     const supervisorExists = await EmployeeModel.findById(supervisor);
     if (!supervisorExists) {
       return res.status(400).json({ message: "El supervisor especificado no existe" });
     }
   }

   const proyectData = {
     code, 
     proyectName, 
     startDate, 
     finishDate, 
     size, 
     state, 
     visible: visible !== undefined ? visible : true, 
     eliminated: eliminated !== undefined ? eliminated : false, 
     saturation, 
     visibility
   };
   
   if (workTeam) proyectData.workTeam = workTeam;
   if (country) proyectData.country = country;
   if (mainAreaArea) proyectData.mainAreaArea = mainAreaArea;
   if (supervisor) proyectData.supervisor = supervisor;

   const newProyect = new ProyectModel(proyectData);

   const validationError = newProyect.validateSync();
   if (validationError) {
     console.error('Error de validación:', validationError);
     return res.status(400).json({ 
       message: "Error de validación", 
       errors: validationError.errors 
     });
   }

   await newProyect.save();
   
   const savedProyect = await ProyectModel.findById(newProyect._id)
     .populate({
       path: 'workTeam',
       populate: {
         path: 'supervisor employees.id',
         model: 'Employee'
       }
     })
     .populate('supervisor')
     .populate('country')
     .populate('mainAreaArea');

   res.status(201).json({
     message: "Proyecto guardado exitosamente",
     proyect: savedProyect
   });
 } catch (error) {
   console.error("Error al crear proyecto:", error);
   res.status(500).json({ message: "Error al crear el proyecto", error: error.message });
 }
}

ProyectController.updateProyect = async(req,res) => {
  try {
    const {
      code, 
      proyectName, 
      startDate, 
      finishDate, 
      size, 
      state, 
      workTeam, 
      country,
      visible, 
      eliminated, 
      saturation, 
      mainAreaArea,
      supervisor,
      visibility
    } = req.body;

    const existingProyect = await ProyectModel.findById(req.params.id);
    if (!existingProyect) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (workTeam) {
      const workTeamExists = await WorkTeamModel.findById(workTeam);
      if (!workTeamExists) {
        return res.status(400).json({ message: "El equipo de trabajo especificado no existe" });
      }
    }

    if (supervisor) {
      const supervisorExists = await EmployeeModel.findById(supervisor);
      if (!supervisorExists) {
        return res.status(400).json({ message: "El supervisor especificado no existe" });
      }
    }

    const updatedProyect = await ProyectModel.findByIdAndUpdate(
      req.params.id,
      {
        code, 
        proyectName, 
        startDate, 
        finishDate, 
        size, 
        state, 
        workTeam, 
        country,
        visible, 
        eliminated, 
        saturation, 
        mainAreaArea,
        supervisor,
        visibility
      },
      {new: true}
    )
    .populate({
      path: 'workTeam',
      populate: {
        path: 'supervisor employees.id',
        model: 'Employee'
      }
    })
    .populate('supervisor')
    .populate('country')
    .populate('mainAreaArea');

    res.json({
      message: "Proyecto actualizado exitosamente",
      proyect: updatedProyect
    });
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    res.status(500).json({ message: "Error al actualizar el proyecto", error: error.message });
  }
}

ProyectController.deleteProyect = async (req, res) => {
  try {
    const proyect = await ProyectModel.findById(req.params.id);
    if (!proyect) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    
    await ProyectModel.findByIdAndDelete(req.params.id);
    res.json({message: "Proyecto eliminado exitosamente"});
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
    res.status(500).json({ message: "Error al eliminar el proyecto", error: error.message });
  }
}

ProyectController.softDeleteProyect = async (req, res) => {
  try {
    const proyect = await ProyectModel.findById(req.params.id);
    if (!proyect) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    
    const updatedProyect = await ProyectModel.findByIdAndUpdate(
      req.params.id,
      { eliminated: true },
      { new: true }
    );
    
    res.json({
      message: "Proyecto marcado como eliminado",
      proyect: updatedProyect
    });
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
    res.status(500).json({ message: "Error al eliminar el proyecto", error: error.message });
  }
};

// NUEVO: Endpoint para obtener proyectos por supervisor CuscaID
ProyectController.getProyectsBySupervisor = async (req, res) => {
  try {
    const { supervisorCuscaId } = req.params; // Obtener el cuscaId del supervisor de los parámetros de la URL

    // 1. Encontrar el ObjectId del supervisor basado en su cuscaId
    const supervisor = await EmployeeModel.findOne({ cuscaId: supervisorCuscaId });

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor no encontrado con el CuscaID proporcionado." });
    }

    // 2. Buscar proyectos donde el supervisor sea el ObjectId encontrado
    const projects = await ProyectModel.find({ supervisor: supervisor._id, eliminated: { $ne: true } })
      .populate('supervisor', 'fullName cuscaId') // Popular solo el nombre y cuscaId del supervisor
      .populate('country')
      .populate('mainAreaArea');

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error al obtener proyectos por supervisor:", error);
    res.status(500).json({ message: "Error al obtener los proyectos del supervisor", error: error.message });
  }
};

// NUEVO: Endpoint para obtener proyectos por WorkTeam IDs (AÑADE ESTE MÉTODO)
ProyectController.getProyectsByWorkTeams = async (req, res) => {
  try {
    const { workTeamIds } = req.body;

    if (!workTeamIds) {
      console.log("[CONTROLLER] Error: workTeamIds no proporcionado");
      return res.status(400).json({
        message: "Se requiere workTeamIds"
      });
    }

    if (!Array.isArray(workTeamIds)) {
      console.log("[CONTROLLER] Error: workTeamIds no es un array");
      return res.status(400).json({
        message: "workTeamIds debe ser un array"
      });
    }

    if (workTeamIds.length === 0) {
      console.log("[CONTROLLER] Error: workTeamIds está vacío");
      return res.status(400).json({
        message: "workTeamIds no puede estar vacío"
      });
    }

    console.log("[CONTROLLER] Buscando proyectos para workTeamIds:", workTeamIds);

    // Buscar proyectos
    const projects = await ProyectModel.find({
        workTeam: { $in: workTeamIds },
        eliminated: { $ne: true }
    })
    .populate('supervisor', 'fullName cuscaId')
    .populate('country', 'name')
    .populate('mainAreaArea', 'name')
    .populate({
      path: 'workTeam',
      populate: {
        path: 'employees.id',
        select: 'fullName cuscaId email',
      },
    })
    .lean(); // .lean() para obtener objetos JS planos y evitar problemas con la mutación de documentos Mongoose

    console.log(`[CONTROLLER] Proyectos encontrados: ${projects.length}`);

    res.status(200).json(projects);

  } catch (error) {
    console.error(`[CONTROLLER] Error al obtener proyectos por workTeamIds: ${error.message}`, error);
    res.status(500).json({
      message: "Error interno del servidor al obtener proyectos por equipos de trabajo.",
      error: error.message
    });
  }
};




export default ProyectController;


