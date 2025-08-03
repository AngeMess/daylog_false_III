import React, { useState, useEffect } from 'react';
import { Plus, User, Filter, Eye, UserX, Edit } from 'lucide-react';
import ActivityModal from '../../components/ActivityModal';
import FilterButton from '../../../../components/ui/FilterButton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '../../../../components/Buttons';
import DropdownMenuComponent from '../../../../components/DropdownMenu/DropdownMenu';
import './Activities.css';

const CustomHeading = ({ text, color }) => (
  <h1 style={{
    color: color,
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '28px',
    fontWeight: 600,
    margin: 0
  }}>
    {text}
  </h1>
);

const ActivityScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);

  const [formData, setFormData] = useState({
    activityType: '',
    status: '',
    startDate: '',
    endTime: '',
    description: ''
  });

  const [activities, setActivities] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterDate, setFilterDate] = useState('Todas');

  // Cargar actividades desde localStorage al montar el componente
  useEffect(() => {
    const storedActivities = localStorage.getItem('activities');
    let initialActivities;

    if (storedActivities) {
      initialActivities = JSON.parse(storedActivities);
    } else {
      initialActivities = [
        { id: 1, name: 'Luis Enrique', date: '20 - Junio - 2025', reason: 'Almuerzo', status: 'En proceso', endTime: '13:00', description: 'Almuerzo de trabajo con el equipo de marketing.' },
        { id: 2, name: 'Luis Enrique', date: '19 - Junio - 2025', reason: 'Reunión', status: 'Pendiente', endTime: '15:30', description: 'Reunión semanal de seguimiento de proyectos.' },
        { id: 3, name: 'Luis Enrique', date: '18 - Junio - 2025', reason: 'Cita médica', status: 'Finalizado', endTime: '11:00', description: 'Cita con el Dr. Smith para revisión anual.' },
        { id: 4, name: 'Luis Enrique', date: '17 - Junio - 2025', reason: 'Capacitación', status: 'Pendiente', endTime: '17:00', description: 'Capacitación sobre nuevas herramientas de software.' },
        { id: 5, name: 'Luis Enrique', date: '16 - Junio - 2025', reason: 'Almuerzo', status: 'Finalizado', endTime: '14:00', description: 'Almuerzo de negocios con un cliente importante.' },
        { id: 6, name: 'Luis Enrique', date: '15 - Junio - 2025', reason: 'Descanso', status: 'En proceso', endTime: '10:00', description: 'Pausa activa para estirar y relajar la mente.' },
        { id: 7, name: 'Luis Enrique', date: '14 - Junio - 2025', reason: 'Reunión', status: 'Finalizado', endTime: '16:00', description: 'Reunión de planificación estratégica del próximo trimestre.' },
        { id: 8, name: 'Luis Enrique', date: '13 - Junio - 2025', reason: 'Cita médica', status: 'En proceso', endTime: '09:30', description: 'Visita al dentista para chequeo de rutina.' },
        { id: 9, name: 'Luis Enrique', date: '12 - Junio - 2025', reason: 'Capacitación', status: 'Finalizado', endTime: '18:00', description: 'Curso intensivo de habilidades de comunicación.' },
        { id: 10, name: 'Luis Enrique', date: '11 - Junio - 2025', reason: 'Descanso', status: 'Pendiente', endTime: '12:00', description: 'Descanso para recargar energías antes de la tarde.' },
        { id: 11, name: 'Luis Enrique', date: '10 - Junio - 2025', reason: 'Almuerzo', status: 'Finalizado', endTime: '13:00', description: 'Almuerzo en la cafetería con compañeros de oficina.' },
        { id: 12, name: 'Luis Enrique', date: '09 - Junio - 2025', reason: 'Reunión', status: 'En proceso', endTime: '15:00', description: 'Reunión con el equipo de desarrollo de producto.' }
      ];
    }

    // Ensure all activities have the name "Luis Enrique"
    const activitiesWithFixedName = initialActivities.map(activity => ({
      ...activity,
      name: 'Luis Enrique'
    }));

    setActivities(activitiesWithFixedName);
    localStorage.setItem('activities', JSON.stringify(activitiesWithFixedName)); // Save updated activities to localStorage
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} - ${month} - ${year}`;
  };

  const getMonthNumber = (monthName) => {
    const months = {
      'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
      'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
    return months[monthName];
  };

  const getStatusClass = (status) => {
    if (status === 'Finalizado') {
      return 'status-completed';
    } else if (status === 'En proceso') {
      return 'status-in-progress';
    } else if (status === 'Pendiente') {
      return 'status-pending';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setActivityToEdit(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      if (!activityToEdit.status || !activityToEdit.endTime) {
        alert('Por favor complete los campos requeridos (Estado, Hora fin)');
        return;
      }

      const updatedActivities = activities.map(act =>
        act.id === activityToEdit.id
          ? {
              ...act,
              status: activityToEdit.status,
              endTime: activityToEdit.endTime,
              description: activityToEdit.description
            }
          : act
      );
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      console.log('Actividad editada:', activityToEdit);

    } else {
      if (!formData.activityType || !formData.status || !formData.startDate || !formData.endTime) {
        alert('Por favor complete todos los campos requeridos');
        return;
      }

      const newActivity = {
        id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
        name: 'Luis Enrique', // Hardcoded name for new activities
        date: formatDate(formData.startDate),
        reason: formData.activityType,
        status: formData.status,
        endTime: formData.endTime,
        description: formData.description
      };

      const updatedActivities = [newActivity, ...activities];
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      console.log('Nueva actividad agregada:', newActivity);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setActivityToEdit(null);
    setFormData({
      activityType: '',
      status: '',
      startDate: '',
      endTime: '',
      description: ''
    });
  };

  const handleEditActivity = (activity) => {
    const dateParts = activity.date.split(' - ');
    const day = dateParts[0];
    const monthIndex = getMonthNumber(dateParts[1]);
    const year = dateParts[2];
    const formattedDateForPicker = new Date(year, monthIndex, day).toISOString().split('T')[0];

    setActivityToEdit({
        ...activity,
        startDate: formattedDateForPicker,
        endTime: activity.endTime || '',
        description: activity.description || ''
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const getFilteredActivities = () => {
    let filtered = activities;

    if (filterStatus !== 'Todos') {
      filtered = filtered.filter(activity => activity.status === filterStatus);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterDate === 'Hoy') {
      filtered = filtered.filter(activity => {
        const dateParts = activity.date.split(' - ');
        if (dateParts.length < 3) return false;
        const activityDate = new Date(Number(dateParts[2]), getMonthNumber(dateParts[1]), Number(dateParts[0]));
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === today.getTime();
      });
    } else if (filterDate === 'Hace una semana') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      filtered = filtered.filter(activity => {
        const dateParts = activity.date.split(' - ');
        if (dateParts.length < 3) return false;
        const activityDate = new Date(Number(dateParts[2]), getMonthNumber(dateParts[1]), Number(dateParts[0]));
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() >= oneWeekAgo.getTime() && activityDate.getTime() < today.getTime();
      });
    }
    return filtered;
  };

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="activity-screen">
        <div className="header">
          <div className="title-section">
            <CustomHeading
              text="Actividades"
              color="#01426A"
            />
          </div>
          <div className="header-actions">
            <FilterButton
              label="Filtrar"
              icon={Filter}
              customContent={
                <div className="filter-menu">
                  <DropdownMenu.Group className="filter-column">
                    <h4>Estado</h4>
                    <DropdownMenu.Item
                      className={`filter-option ${filterStatus === 'Todos' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('Todos')}
                    >
                      <span>Todos</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={`filter-option ${filterStatus === 'En proceso' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('En proceso')}
                    >
                      <span>En Proceso</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={`filter-option ${filterStatus === 'Finalizado' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('Finalizado')}
                    >
                      <span>Finalizado</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={`filter-option ${filterStatus === 'Pendiente' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('Pendiente')}
                    >
                      <span>Pendiente</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group className="filter-column">
                    <h4>Fecha</h4>
                    <DropdownMenu.Item
                      className={`filter-option ${filterDate === 'Todas' ? 'active' : ''}`}
                      onClick={() => setFilterDate('Todas')}
                    >
                      <span>Todas</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={`filter-option ${filterDate === 'Hoy' ? 'active' : ''}`}
                      onClick={() => setFilterDate('Hoy')}
                    >
                      <span>Hoy</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={`filter-option ${filterDate === 'Hace una semana' ? 'active' : ''}`}
                      onClick={() => setFilterDate('Hace una semana')}
                    >
                      <span>Hace una semana</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </div>
              }
            />

            <Button variant="btn_primary" onClick={() => { setIsEditing(false); setIsModalOpen(true); }}>
              <Plus size={18} />
              Añadir actividad
            </Button>

          </div>
        </div>

        <div className="table-container">
          <table className="activities-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {getFilteredActivities().map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        <User size={20} />
                      </div>
                      <span className="user-name">{activity.name}</span>
                    </div>
                  </td>
                  <td>{activity.date}</td>
                  <td>{activity.reason}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(activity.status)}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td>
                    <DropdownMenuComponent
                      options={[
                        {
                          label: "Editar",
                          icon: Edit,
                          onClick: () => handleEditActivity(activity)
                        }
                      ]}
                      triggerColor="#667085"
                      hoverColor="#D6AC50"
                      backgroundColor="white"
                      iconSize={16}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={isEditing ? activityToEdit : formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        activityToEdit={activityToEdit}
      />
    </div>
  );
};

export default ActivityScreen;