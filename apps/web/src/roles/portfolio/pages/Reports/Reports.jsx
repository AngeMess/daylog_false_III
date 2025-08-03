import React from 'react';
import TableDemo from './tableEmployees/TableDemo';
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomDescription from '../../../../components/Titles/TitleH3';

export default function Reports() {
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-2">
                <CustomHeading
                    text="Reportes"
                    color="#01426A"
                />
            </div>
            <div className="flex justify-between items-center mb-8">
                <CustomDescription
                    text="Empleados dentro de DayLog"
                />
            </div>
            <TableDemo/>
        </div>
    );
}
