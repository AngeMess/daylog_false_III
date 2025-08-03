import React from 'react';
import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';

const EmployeeList = ({ employees }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Equipo</h3>
        <p className="text-sm text-gray-500">Empleados bajo supervisión</p>
      </div>
      <div className="p-2 rounded-xl bg-gray-50">
        <Users className="h-5 w-5 text-[#FFC600]" />
      </div>
    </div>
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {employees.map((employee, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              employee.status === 'Activo' ? 'bg-green-500' : 
              employee.status === 'Inactivo' ? 'bg-gray-400' :
              employee.status === 'Deshabilitado' ? 'bg-red-500' :
              'bg-[#FFC600]'
            }`}></div>
            <span className="text-sm text-gray-600">{employee.status}</span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default EmployeeList; 