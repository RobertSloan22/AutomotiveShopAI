import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const PartsInventory = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        lowStock: false
    });

    useEffect(() => {
        fetchParts();
    }, [filters]);

    const fetchParts = async () => {
        try {
            const response = await axiosInstance.get('/parts', { params: filters });
            setParts(response.data);
        } catch (error) {
            console.error('Error fetching parts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Parts Inventory</h2>
                <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {/* Open add part modal */}}
                >
                    Add New Part
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search parts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-gray-700 text-white rounded px-4 py-2"
                />
                <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="bg-gray-700 text-white rounded px-4 py-2"
                >
                    <option value="">All Categories</option>
                    <option value="brakes">Brakes</option>
                    <option value="engine">Engine</option>
                    <option value="electrical">Electrical</option>
                    <option value="suspension">Suspension</option>
                </select>
                <label className="flex items-center text-white">
                    <input
                        type="checkbox"
                        checked={filters.lowStock}
                        onChange={(e) => setFilters({...filters, lowStock: e.target.checked})}
                        className="mr-2"
                    />
                    Low Stock Only
                </label>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-white">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3 text-left">Part Number</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-right">Quantity</th>
                            <th className="p-3 text-right">Price</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parts.map(part => (
                            <tr key={part._id} className="border-b border-gray-700">
                                <td className="p-3">{part.partNumber}</td>
                                <td className="p-3">{part.description}</td>
                                <td className="p-3">{part.category}</td>
                                <td className={`p-3 text-right ${
                                    part.quantity <= part.minimumStock ? 'text-red-400' : ''
                                }`}>
                                    {part.quantity}
                                </td>
                                <td className="p-3 text-right">${part.price.toFixed(2)}</td>
                                <td className="p-3 text-center">
                                    <button 
                                        className="text-blue-400 hover:text-blue-300 mr-2"
                                        onClick={() => {/* Edit part */}}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="text-red-400 hover:text-red-300"
                                        onClick={() => {/* Delete part */}}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartsInventory; 