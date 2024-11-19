import React, { useState, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';

const ServiceHistory = () => {
    const { currentVehicle } = useCustomer();
    const [services, setServices] = useState([]);
    const [filters, setFilters] = useState({
        dateRange: 'all',
        serviceType: 'all'
    });

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Service History</h2>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    className="bg-gray-700 text-white rounded px-4 py-2"
                >
                    <option value="all">All Time</option>
                    <option value="year">Past Year</option>
                    <option value="month">Past Month</option>
                </select>

                <select
                    value={filters.serviceType}
                    onChange={(e) => setFilters({...filters, serviceType: e.target.value})}
                    className="bg-gray-700 text-white rounded px-4 py-2"
                >
                    <option value="all">All Services</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repairs</option>
                    <option value="diagnostic">Diagnostics</option>
                </select>
            </div>

            {/* Service Timeline */}
            <div className="space-y-6">
                {services.map(service => (
                    <div key={service._id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {service.serviceType}
                                </h3>
                                <p className="text-gray-400">
                                    {new Date(service.date).toLocaleDateString()}
                                </p>
                            </div>
                            <span className="text-gray-400">
                                Mileage: {service.mileage.toLocaleString()}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="text-gray-300">
                                <h4 className="font-medium mb-1">Services Performed</h4>
                                <ul className="list-disc list-inside">
                                    {service.servicesPerformed.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {service.parts.length > 0 && (
                                <div className="text-gray-300">
                                    <h4 className="font-medium mb-1">Parts Used</h4>
                                    <ul className="list-disc list-inside">
                                        {service.parts.map((part, index) => (
                                            <li key={index}>
                                                {part.description} (x{part.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {service.notes && (
                                <div className="text-gray-300">
                                    <h4 className="font-medium mb-1">Notes</h4>
                                    <p>{service.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceHistory; 