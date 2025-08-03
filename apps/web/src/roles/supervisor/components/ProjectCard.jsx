import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

// The onClick prop will be passed from the parent and executed when the card is clicked.
// This component itself does not dictate *what* happens on click, only that it can be clicked.
const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 p-6 flex justify-between items-center cursor-pointer"
      onClick={onClick} // This uses the onClick prop passed from the parent
    >
      <div>
        <h3 className="font-semibold text-lg text-[#01426A] mb-1">{project.proyectName}</h3>
        {project.supervisor && (
          <p className="text-gray-600 text-sm mb-1">Supervisor: {project.supervisor.fullName}</p>
        )}
        <p className="text-gray-500 text-sm">
          Fecha: {project.startDate ? format(new Date(project.startDate), 'dd-MM-yyyy') : 'N/A'}
          {project.finishDate && ` - ${format(new Date(project.finishDate), 'dd-MM-yyyy')}`}
        </p>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          project.state === "En proceso"
            ? "bg-[#01426A] text-white"
            : project.state === "Pendiente"
            ? "bg-gray-300 text-gray-800"
            : project.state === "Finalizado"
            ? "bg-green-100 text-green-800"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {project.state}
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    proyectName: PropTypes.string.isRequired,
    supervisor: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
    }),
    startDate: PropTypes.string,
    finishDate: PropTypes.string,
    state: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired, // It expects an onClick function to be passed
};

export default ProjectCard;