import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSEmployeeApi from '../../../hooks/useSEmployeeApi';

const useDetailsEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, loading, error } = useSEmployeeApi();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (id && employees) {
      const employee = employees.find(emp => emp._id === id);
      setSelectedEmployee(employee || null);
    }
  }, [id, employees]);

  return {
    id,
    employees,
    loading,
    error,
    selectedEmployee,
    setSelectedEmployee,
    navigate
  };
};

export default useDetailsEmployee;
