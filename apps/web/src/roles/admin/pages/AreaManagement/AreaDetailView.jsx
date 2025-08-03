import React, { useState } from 'react';
import { ChevronDown, Search as SearchIcon, Triangle, Pyramid, ArrowLeft, User } from "lucide-react";
import { Button } from '../EmployeeManagement/tableEmployees/Button';
import { Badge } from '../EmployeeManagement/tableEmployees/Badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../EmployeeManagement/tableEmployees/Table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../EmployeeManagement/tableEmployees/DropdownMenu";

const AreaDetailView = ({ area, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Datos de ejemplo para las tablas de empleados
  const employeesData = [
    { 
      id: 1, 
      name: "Ángel Romero", 
      initials: "AR", 
      cuscaId: "AJ0876A", 
      jefe: "Ernesto Pérez", 
      rol: "Supervisor", 
      pais: "El Salvador",
      paisColor: "blue" 
    },
    { 
      id: 2, 
      name: "Ángel Romero", 
      initials: "AR", 
      cuscaId: "AJ0876A", 
      jefe: "Ernesto Pérez", 
      rol: "Empleado", 
      pais: "Guatemala",
      paisColor: "purple" 
    },
    { 
      id: 3, 
      name: "Ángel Romero", 
      initials: "AR", 
      cuscaId: "AJ0876A", 
      jefe: "Ernesto Pérez", 
      rol: "Empleado", 
      pais: "Honduras",
      paisColor: "red" 
    }
  ];
  
  // Función para generar el badge/etiqueta del país
  const renderCountryBadge = (country) => {
    const countryToVariant = {
      "El Salvador": "elsalvador",
      "Guatemala": "guatemala",
      "Honduras": "honduras"
    };
    
    const variant = countryToVariant[country] || "default";
    
    return (
      <Badge variant={variant}>
        {country}
      </Badge>
    );
  };
  
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="p-6">
        {/* Header con botón Volver */}
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#01426A' }}>Áreas</h1>
          <Button
            variant="outline"
            className="bg-white text-[#01426A] border-[#01426A] hover:bg-[#01426A]/20 rounded-full flex items-center"
            onClick={onClose}
          >
            <ArrowLeft size={16} className="mr-1" />
            Volver
          </Button>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center border border-gray-100">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Triangle className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Área o Subárea</h3>
            <p className="text-sm text-gray-500">{area.area}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center border border-gray-100">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Pyramid className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Área Madre</h3>
            <p className="text-sm text-gray-500">{area.areaMadre}</p>
          </div>
        </div>

        {/* Barra de búsqueda y contador de empleados */}
        <div className="flex justify-between items-center mb-6">
          {/* Contador de empleados */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700">
            <span>Cant. empleados: </span>
            <span className="font-semibold ml-1">{area.empleados}</span>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-60 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#01426A] shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-[#f9fafb]">
                <TableHead className="h-11">
                  <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider pl-12">
                    <span>Nombre</span> <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="h-11">
                  <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>CuscaID</span> <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="h-11">
                  <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>Jefe Inm.</span> <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="h-11">
                  <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>Rol</span> <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="h-11">
                  <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>País</span> <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </TableHead>

              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-0">
              {employeesData.length > 0 ? (
                employeesData.map((employee) => (
                  <TableRow 
                    key={employee.id} 
                    className="border-b border-border transition-colors hover:bg-[#F9FAFB] data-[state=selected]:bg-muted"
                  >
                    <TableCell className="p-3 align-middle">
                      <div className="flex items-center">
                        <div className="h-8 w-8 mr-3">
                          <User className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
                        </div>
                        <span className="font-medium">{employee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-3 align-middle text-sm text-gray-600">{employee.cuscaId}</TableCell>
                    <TableCell className="p-3 align-middle text-sm text-gray-600">{employee.jefe}</TableCell>
                    <TableCell className="p-3 align-middle text-sm text-gray-600">{employee.rol}</TableCell>
                    <TableCell className="p-3 align-middle">
                      {renderCountryBadge(employee.pais)}
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay empleados registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AreaDetailView;
