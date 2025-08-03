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
import useEmployeeApi from "../../../hooks/useSEmployeeApi";
import DropdownMenuComponent from '../../../../../components/DropdownMenu/DropdownMenu';
import { LoadingState, ErrorState, EmptyState } from '../../../../../components/ui/stateHandler'; // Importar los componentes de estado

import {
  ArrowDown,
  ArrowUp,
  CircleAlert,
  CheckCircle2,
  CircleX,
  CircleHelp,
  EllipsisVertical,
  Filter,
  Plus,
  Trash,
  User,
  FileText,
  ShieldBan,
  PenLine,
  Search,
  Users,
  Bell,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Función de filtro personalizada para búsqueda en múltiples columnas
const multiColumnFilterFn = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.fullName} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

// Función de filtro para el país
const paisFilterFn = (row, columnId, filterValue) => {
  if (!filterValue?.length) return true;
  const pais = row.getValue(columnId);
  return filterValue.includes(pais);
};

// Función de filtro para el rol
const rolFilterFn = (row, columnId, filterValue) => {
  if (!filterValue?.length) return true;
  const rol = row.getValue(columnId);
  return filterValue.includes(rol);
};

// Función de filtro para el estado
const estadoFilterFn = (row, columnId, filterValue) => {
  if (!filterValue?.length) return true;
  const isActive = row.original.isActive;
  const estado = filterValue[0]; // Tomamos el primer valor del array
  
  if (estado === "Habilitado") {
    return isActive;
  } else if (estado === "Inhabilitado") {
    return !isActive;
  }
  return true;
};

// Componente para acciones de fila
function RowActions({ row, onEmployeeUpdated, supervisorMode }) {
  const navigate = useNavigate();
  const { updateEmployee } = useEmployeeApi();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleViewDetails = () => {
    if (supervisorMode) {
      navigate(`/supervisor/empleados/detalle-empleado/${row.original._id}`);
    } else {
      navigate(`/admin/gestionEmpleados/detalle-empleado/${row.original._id}`);
    }
  };

  const handleAddReminder = () => {
    if (supervisorMode) {
      navigate(`/supervisor/empleados/agregar-recordatorio/${row.original._id}`);
    } else {
      alert('Funcionalidad de agregar recordatorio (solo supervisor)');
    }
  };

  const handleEditEmployee = () => {
    navigate(`/admin/gestionEmpleados/editar-empleado/${row.original._id}`);
  };

  const handleDeleteEmployee = async () => {
    setIsDeleting(true);
    try {
      await updateEmployee(row.original._id, {
        isActive: false
      });
      if (onEmployeeUpdated) {
        await onEmployeeUpdated();
      }
    } catch (error) {
      console.error("Error al deshabilitar empleado:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  let menuOptions;
  if (supervisorMode) {
    menuOptions = [
      {
        label: "Mostrar todo",
        icon: FileText,
        onClick: handleViewDetails
      },
      {
        label: "Agregar recordatorio",
        icon: Bell,
        onClick: handleAddReminder
      }
    ];
  } else {
    menuOptions = [
      {
        label: "Mostrar todo",
        icon: FileText,
        onClick: handleViewDetails
      },
      {
        label: "Editar",
        icon: PenLine,
        onClick: handleEditEmployee
      },
      {
        label: isDeleting ? "Deshabilitando..." : "Deshabilitar",
        icon: ShieldBan,
        onClick: isDeleting ? undefined : handleDeleteEmployee
      }
    ];
  }
  
  return (
    <DropdownMenuComponent
      options={menuOptions}
      triggerColor="#667085"
      hoverColor="#D6AC50"
      backgroundColor="white"
      iconSize={16}
    />
  );
}

const EmployeeTable = ({ supervisorMode = false }) => {
  const navigate = useNavigate();
  const id = useId();
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([{ id: "fullName", desc: false }]);
  const [selectedRol, setSelectedRol] = useState("");
  const [selectedPais, setSelectedPais] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const inputRef = useRef(null);

  // Usar el hook de empleados
  const {
    employees,
    loading,
    error,
    getEmployees,
    deleteEmployee
  } = useEmployeeApi();

  // Obtener el cuscaId del supervisor logueado
  let supervisorCuscaId = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    supervisorCuscaId = user?.cuscaId || null;
  } catch (e) {
    supervisorCuscaId = null;
  }

  // Filtrar empleados si es modo supervisor
  const filteredEmployees = React.useMemo(() => {
    if (!supervisorMode || !supervisorCuscaId) return employees || [];
    return (employees || []).filter(emp => {
      // El campo inmediateBoss puede ser string o un objeto
      if (!emp.inmediateBoss) return false;
      if (typeof emp.inmediateBoss === 'string') {
        return emp.inmediateBoss === supervisorCuscaId;
      }
      if (typeof emp.inmediateBoss === 'object') {
        return emp.inmediateBoss.cuscaId === supervisorCuscaId;
      }
      return false;
    });
  }, [employees, supervisorMode, supervisorCuscaId]);

  // Cargar empleados al montar el componente
  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesData = await getEmployees();
      console.log('Empleados cargados:', employeesData);
      if (employeesData && employeesData.length > 0) {
        console.log('Primer empleado:', employeesData[0]);
      }
    };
    fetchEmployees();
  }, [getEmployees]);

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
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "CuscaID",
      accessorKey: "cuscaId",
      size: 90,
    },
    {
      header: "Jefe Inmediato",
      accessorKey: "inmediateBoss",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.getValue("inmediateBoss")}
        </div>
      ),
      size: 150,
    },
    {
      header: "Rol",
      accessorKey: "daylogRol",
      size: 100,
      filterFn: rolFilterFn,
    },
    {
      header: "Área",
      accessorKey: "mainAreaArea",
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          {row.getValue("mainAreaArea")}
        </div>
      ),
      size: 250,
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
      filterFn: paisFilterFn,
    },
    {
      header: "Estado",
      accessorKey: "isActive",
      size: 150,
      filterFn: "isActive",
      enableHiding: false,
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? "habilitado" : "inhabilitado"}
        >
          {row.original.isActive ? "Habilitado" : "Inhabilitado"}
        </Badge>
      )
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => <RowActions row={row} supervisorMode={supervisorMode} />,
      size: 60,
      enableHiding: false,
    },
  ], []);

  // Función para eliminar filas seleccionadas
  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    try {
      await Promise.all(
        selectedRows.map(row => deleteEmployee(row.original._id))
      );
      await getEmployees(); // Refrescar la lista después de eliminar
      table.resetRowSelection();
    } catch (error) {
      console.error("Error al eliminar empleados:", error);
    }
  };

  // Función para reintentar cargar empleados
  const handleRetry = () => {
    getEmployees();
  };

  // Configuración de la tabla
  const table = useReactTable({
    data: filteredEmployees,
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
    filterFns: {
      isActive: (row, columnId, filterValue) => {
        const isActive = row.original.isActive;
        const estadoFilter = filterValue[0];
        return estadoFilter === "Habilitado" ? isActive : !isActive;
      }
    }
  });

  // Obtener valores únicos de rol
  const uniqueRolValues = useMemo(() => {
    return ["Empleado", "Supervisor", "Portafolio", "Admin"];
  }, []);

  // Obtener valores únicos de país
  const uniquePaisValues = useMemo(() => {
    return ["El Salvador", "Honduras", "Guatemala"];
  }, []);

  // Obtener valores únicos de estado
  const uniqueEstadoValues = useMemo(() => {
    return ["Habilitado", "Inhabilitado"];
  }, []);

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

  // Manejar selección de estado
  const handleEstadoSelect = (estado) => {
    if (selectedEstado === estado) {
      setSelectedEstado("");
      table.getColumn("isActive")?.setFilterValue(undefined);
    } else {
      setSelectedEstado(estado);
      table.getColumn("isActive")?.setFilterValue([estado]);
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
          {/* Filtrar por estado con componente reutilizable */}
          <FilterButton
            label="Estado"
            icon={CircleHelp}
            options={uniqueEstadoValues.map(estado => ({ value: estado, label: estado }))}
            onSelect={handleEstadoSelect}
            selectedValue={selectedEstado}
            title="Estado"
          />
        </div>
        <div className="flex items-center gap-3">
          {/* Botón eliminar */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
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
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                    aria-hidden="true"
                  >
                    <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
                      {table.getSelectedRowModel().rows.length} {" "}
                      {table.getSelectedRowModel().rows.length === 1 ? "empleado" : "empleados"} seleccionados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Botón añadir usuario */}
          {!supervisorMode && (
            <Button className="mr-auto" variant="btn_primary" onClick={() => navigate('/admin/gestionEmpleados/agregar-empleado')}>
              <Plus size={20} />
              Crear Empleado
            </Button>
          )}

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
        <div className="max-h-[650px] overflow-y-auto">
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
                        {cell.column.id === 'actions' ? (
                          <RowActions 
                            row={row} 
                            onEmployeeUpdated={getEmployees} 
                            supervisorMode={supervisorMode} 
                          />
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
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