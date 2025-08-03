import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';

const RecentProjects = ({ projects }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Proyectos</h3>
        <p className="text-sm text-gray-500">Estado actual</p>
      </div>
      <div className="p-2 rounded-xl bg-gray-50">
        <FolderOpen className="h-5 w-5 text-[#FFC600]" />
      </div>
    </div>
    <div className="space-y-4 max-h-64 overflow-y-auto">
      {projects.map((project, index) => (
        <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">{project.name}</h4>
            <div className="flex gap-2 items-center">
              <span className={`text-xs px-3 py-1 rounded-full ${
                project.status === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                project.status === 'Finalizado' ? 'bg-green-50 text-green-700' :
                project.status === 'Atrasado' ? 'bg-red-50 text-red-700' :
                project.status === 'Pendiente' ? 'bg-blue-100 text-blue-800' :
                project.status === 'Cancelado' ? 'bg-gray-100 text-gray-800' :
                project.status === 'En riesgo' ? 'bg-purple-100 text-purple-800' :
                project.status === 'Repriorizado' ? 'bg-pink-100 text-pink-800' :
                'bg-[#FFC600]/10 text-[#FFC600]'
              }`}>
                {project.status === 'En proceso' && 'Desarrollo'}
                {project.status === 'Finalizado' && 'Finalizado'}
                {project.status === 'Atrasado' && 'Atrasado'}
                {project.status === 'Pendiente' && 'Pendiente'}
                {project.status === 'Cancelado' && 'Cancelado'}
                {project.status === 'En riesgo' && 'Riesgo'}
                {project.status === 'Repriorizado' && 'Repriorizado'}
                {![
                  'En proceso',
                  'Finalizado',
                  'Atrasado',
                  'Pendiente',
                  'Cancelado',
                  'En riesgo',
                  'Repriorizado'
                ].includes(project.status) && project.status}
              </span>
              {/* Badge de saturación */}
              {project.saturation && (
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  project.saturation === 'Baja' ? 'bg-green-100 text-green-800' :
                  project.saturation === 'Normal' ? 'bg-blue-100 text-blue-800' :
                  project.saturation === 'Alta' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Saturación {project.saturation}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Vence: {project.dueDate}</span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default RecentProjects; 