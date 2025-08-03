import React from 'react';
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomDescription from '../../../../components/Titles/TitleH3';
import TableDemo from '../../../admin/pages/EmployeeManagement/tableEmployees/TableDemo';

export default function Employees() {
  return (
    <div className="p-4 text-left">
      <div className="text-left">
        <CustomHeading 
          text="Gestión de Empleados"    
          color="#01426A" 
        />
        <br />
        <CustomDescription 
          text="Empleados a tu cargo dentro de DayLog" 
        />
        <br />
        <TableDemo supervisorMode />
      </div>
    </div>
  );
}
