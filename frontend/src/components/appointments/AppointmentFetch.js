import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get('/appointments');
      
      const formattedAppointments = data.map(apt => ({
        ...apt,
        start: new Date(apt.start),
        end: new Date(apt.end),
        time: new Date(apt.start).toISOString().slice(0, 16),
        title: `${apt.customerName} - ${apt.vehicle}`
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    isLoading,
    error,
    refreshAppointments: fetchAppointments
  };
};

export default useAppointments;