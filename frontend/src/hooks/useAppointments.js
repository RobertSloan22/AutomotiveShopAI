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
      const response = await axiosInstance.get('/appointments');
      const formattedAppointments = response.data.map(apt => ({
        ...apt,
        start: new Date(apt.start),
        end: new Date(apt.end),
        time: new Date(apt.start).toISOString().slice(0, 16),
        title: `${apt.customerName} - ${apt.vehicle}`
      }));
      
      setAppointments(formattedAppointments);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch appointments on component mount
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
