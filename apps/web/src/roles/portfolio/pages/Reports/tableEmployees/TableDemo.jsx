import React, { useState, useEffect, useId, useMemo, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import FilterButton from "../../../../../components/ui/FilterButton";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./AlertDialog";
import { Badge } from "../../../../../components/Badges";
import { Button } from "../../../../../components/Buttons";
import { SearchComponent } from "../../../../../components/Search";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./DropdownMenu";
import { Input } from "./Input";
import { Label } from "./Label";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { LoadingState, ErrorState, EmptyState } from '../../../../../components/ui/stateHandler.jsx'; // Importar los componentes de estado
import { generateUserReports } from '../../../../../utils/reportGenerator.js'; // Importar utilidad de reportes

import {
  ArrowDown,
  ArrowUp,
  CircleX,
  CircleHelp,
  Filter,
  Plus,
  Trash,
  User,
  Search,
  Users,
  FileText,
  Download,
  FileSpreadsheet
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Datos quemados de empleados
const mockEmployees = [
  {
    _id: '1',
    fullName: 'Juan Carlos Chavez Pérez',
    email: 'juan.perez@example.com',
    cuscaId: 'EMP001',
    inmediateBoss: 'María García',
    daylogRol: 'Empleado',
    mainAreaArea: 'Desarrollo',
    country: 'El Salvador',
    isActive: true
  },
  {
    _id: '2',
    fullName: 'Ana Marina Lopez Martínez',
    email: 'ana.martinez@example.com',
    cuscaId: 'EMP002',
    inmediateBoss: 'Carlos López',
    daylogRol: 'Supervisor',
    mainAreaArea: 'Recursos Humanos',
    country: 'Guatemala',
    isActive: true
  },
  {
    _id: '3',
    fullName: 'Pedro Porro Pedriño Ramírez',
    email: 'pedro.ramirez@example.com',
    cuscaId: 'EMP003',
    inmediateBoss: 'Luisa Fernández',
    daylogRol: 'Portafolio',
    mainAreaArea: 'Ventas',
    country: 'Honduras',
    isActive: false
  },
  {
    _id: '4',
    fullName: 'Laura Camila Sanchez Sánchez',
    email: 'laura.sanchez@example.com',
    cuscaId: 'EMP004',
    inmediateBoss: 'Jorge Díaz',
    daylogRol: 'Admin',
    mainAreaArea: 'Tecnología',
    country: 'El Salvador',
    isActive: true
  },
  {
    _id: '5',
    fullName: 'Carlos Alonso Paredes Gómez',
    email: 'carlos.gomez@example.com',
    cuscaId: 'EMP005',
    inmediateBoss: 'Ana Martínez',
    daylogRol: 'Empleado',
    mainAreaArea: 'Marketing',
    country: 'Guatemala',
    isActive: true
  },
  {
    _id: '6',
    fullName: 'Carlos Alonso Paredes Gómez',
    email: 'carlos.gomez@example.com',
    cuscaId: 'EMP005',
    inmediateBoss: 'Ana Martínez',
    daylogRol: 'Empleado',
    mainAreaArea: 'Marketing',
    country: 'Guatemala',
    isActive: true
  },
  {
    _id: '7',
    fullName: 'Carlos Alonso Paredes Gómez',
    email: 'carlos.gomez@example.com',
    cuscaId: 'EMP005',
    inmediateBoss: 'Ana Martínez',
    daylogRol: 'Empleado',
    mainAreaArea: 'Marketing',
    country: 'Guatemala',
    isActive: true
  }
];

const EmployeeTable = () => {
  const navigate = useNavigate();
  const id = useId();
  const [employees] = useState(mockEmployees);
  const [loading] = useState(false);
  const [error] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [selectedRol, setSelectedRol] = useState("");
  const [selectedPais, setSelectedPais] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const inputRef = useRef(null);


  // Definición de columnas
  const columns = useMemo(() => [
    {
      id: "select",
      cell: () => (
        <User
          className="ms-1 me-2 opacity-60"
          size={25}
          strokeWidth={2}
          aria-hidden="true"
        />
      ),
      size: 38,
      enableSorting: false,
      enableHiding: false,
    },

    {
      header: "Nombre",
      accessorKey: "fullName",
      cell: ({ row }) => <div className="font-medium">{row.getValue("fullName")}</div>,
      size: 200,
      filterFn: (row, columnId, filterValue) => {
        const searchableRowContent = `${row.original.fullName} ${row.original.email}`.toLowerCase();
        const searchTerm = (filterValue ?? "").toLowerCase();
        return searchableRowContent.includes(searchTerm);
      },
      enableHiding: false,
    },
    {
      header: "CuscaID",
      accessorKey: "cuscaId",
      size: 100,
    },
    {
      header: "Rol",
      accessorKey: "daylogRol",
      size: 100,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue?.length) return true;
        const rol = row.getValue(columnId);
        return filterValue.includes(rol);
      }
    },
    {
      header: "Área",
      accessorKey: "mainAreaArea",
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          {row.getValue("mainAreaArea")}
        </div>
      ),
      size: 150,
    },
    {
      header: "País",
      accessorKey: "country",
      cell: ({ row }) => (
        <Badge
          variant={
            row.getValue("country") === "El Salvador" ? "elsalvador" :
              row.getValue("country") === "Guatemala" ? "guatemala" : "honduras"
          }
        >
          {row.getValue("country")}
        </Badge>
      ),
      size: 150,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue?.length) return true;
        const pais = row.getValue(columnId);
        return filterValue.includes(pais);
      }
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="btn_primary" 
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Generar Reporte
              <ArrowDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            <DropdownMenuItem 
              onClick={() => handleGenerateReport(row.original, 'pdf')}
              className="cursor-pointer"
            >
              <FileText size={16} className="mr-2 text-red-600" />
              Descargar PDF
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleGenerateReport(row.original, 'excel')}
              className="cursor-pointer"
            >
              <FileSpreadsheet size={16} className="mr-2 text-green-600" />
              Descargar Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 180,
      enableHiding: false,
    },
  ], []);

  // Función para eliminar filas seleccionadas (versión simulada)
  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    console.log('Filas seleccionadas para eliminar:', selectedRows.map(row => row.original.fullName));
    alert(`Se simularía la eliminación de ${selectedRows.length} empleados`);
    table.resetRowSelection();
  };

  // Función para reintentar cargar empleados (versión simulada)
  const handleRetry = () => {
    console.log('Reintentando cargar empleados...');
  };

  // Función para generar reportes individuales
  const handleGenerateReport = async (user, format) => {
    setGeneratingReport(true);
    try {
      console.log(`Generando reporte ${format.toUpperCase()} para ${user.fullName}...`);
      
      const result = generateUserReports(user, format);
      
      if (result.success) {
        // Mostrar mensaje de éxito
        alert(`✅ ${result.message}\n\nReporte ${format.toUpperCase()} generado para: ${user.fullName}\nRol: ${user.daylogRol}\nÁrea: ${user.mainAreaArea}`);
      } else {
        // Mostrar mensaje de error
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert(`❌ Error inesperado al generar el reporte: ${error.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Configuración de la tabla
  const table = useReactTable({
    data: employees || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // Valores únicos para filtros
  const uniqueRolValues = ["Empleado", "Supervisor", "Portafolio", "Admin"];
  const uniquePaisValues = ["El Salvador", "Honduras", "Guatemala"];

  // Manejar selección de rol
  const handleRolSelect = (rol) => {
    if (selectedRol === rol) {
      setSelectedRol("");
      table.getColumn("daylogRol")?.setFilterValue(undefined);
    } else {
      setSelectedRol(rol);
      table.getColumn("daylogRol")?.setFilterValue([rol]);
    }
  };

  // Manejar selección de país
  const handlePaisSelect = (pais) => {
    if (selectedPais === pais) {
      setSelectedPais("");
      table.getColumn("country")?.setFilterValue(undefined);
    } else {
      setSelectedPais(pais);
      table.getColumn("country")?.setFilterValue([pais]);
    }
  };



  // Estados de la interfaz
  if (loading) {
    return <LoadingState message="Cargando empleados..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Error al cargar los empleados"
        onRetry={handleRetry}
      />
    );
  }

  // Solo mostrar estado vacío si NO está cargando, NO hay error, y realmente no hay empleados
  if (!employees || employees.length === 0) {
    return (
      <EmptyState
        message="No hay empleados registrados"
        description="Comienza agregando el primer empleado a tu sistema"
        icon={Users}
        iconColor="text-blue-400"
        actionButton={
          <Button
            variant="btn_primary"
            onClick={() => navigate('/admin/gestionEmpleados/agregar-empleado')}
          >
            <Plus size={16} />
            Crear Primer Empleado
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filtro de Rol y País con componente reutilizable */}
          <FilterButton
            label="Filtrar"
            icon={Filter}
            title="Filtros"
            onSelect={() => {}}
            customContent={
              <div className="grid grid-cols-2 w-full">
                <div>
                  <h3 className="text-sm font-semibold text-[#194167]">Rol</h3>
                  <div className="space-y-2">
                    {uniqueRolValues.map((rol) => (
                      <div
                        key={rol}
                        className="flex items-center cursor-pointer hover:bg-gray-50 hover:text-[#D6AC50] transition-all px-2 py-1 rounded text-[#667085]"
                        onClick={() => handleRolSelect(rol)}
                      >
                        <span className={`text-sm ${selectedRol === rol ? 'text-[#D6AC50] font-medium' : ''}`}>
                          {rol}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-10">
                  <h3 className="text-sm font-semibold text-[#194167]">País</h3>
                  <div className="space-y-2">
                    {uniquePaisValues.map((pais) => (
                      <div
                        key={pais}
                        className="flex items-center cursor-pointer hover:bg-gray-50 hover:text-[#D6AC50] transition-all px-2 py-1 rounded text-[#667085]"
                        onClick={() => handlePaisSelect(pais)}
                      >
                        <span className={`text-sm ${selectedPais === pais ? 'text-[#D6AC50] font-medium' : ''}`}>
                          {pais}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          />

        </div>
        <div className="flex items-center gap-3">
          {/* Botón eliminar (simulado) */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <Button
              className="ml-auto"
              variant="outline"
              onClick={handleDeleteRows}
            >
              <Trash
                className="-ms-1 me-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Eliminar
              <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                {table.getSelectedRowModel().rows.length}
              </span>
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">

          {/* Filtrar por nombre o email */}
          <div className="relative">
            <SearchComponent
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9",
                Boolean(table.getColumn("fullName")?.getFilterValue()) && "pe-9",
              )}
              value={(table.getColumn("fullName")?.getFilterValue() ?? "")}
              onChange={(e) => table.getColumn("fullName")?.setFilterValue(e.target.value)}
              placeholder="Buscar por nombre o email"
              type="text"
              aria-label="Filtrar por nombre o email"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <Search size={18} strokeWidth={2} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("fullName")?.getFilterValue()) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Limpiar filtro"
                onClick={() => {
                  table.getColumn("fullName")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleX size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="max-h-[720px] overflow-y-auto">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className="h-11"
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <div
                            className={cn(
                              header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              if (
                                header.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            tabIndex={header.column.getCanSort() ? 0 : undefined}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: (
                                <ArrowUp
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              ),
                              desc: (
                                <ArrowDown
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              ),
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:py-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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

export default EmployeeTable;