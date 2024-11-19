import React, { useState, useEffect } from 'react';

const ReportsDashboard = () => {
    const [reportData, setReportData] = useState({
        revenue: 0,
        services: 0,
        customers: 0,
        satisfaction: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch report data
        setLoading(false);
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Reports Dashboard</h2>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-gray-400 mb-2">Revenue</h3>
                            <p className="text-2xl font-bold text-white">
                                ${reportData.revenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-gray-400 mb-2">Services Completed</h3>
                            <p className="text-2xl font-bold text-white">
                                {reportData.services}
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-gray-400 mb-2">New Customers</h3>
                            <p className="text-2xl font-bold text-white">
                                {reportData.customers}
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-gray-400 mb-2">Customer Satisfaction</h3>
                            <p className="text-2xl font-bold text-white">
                                {reportData.satisfaction}%
                            </p>
                        </div>
                    </div>

                    {/* Charts and Detailed Reports */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Revenue Trends
                            </h3>
                            {/* Add chart component here */}
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Service Distribution
                            </h3>
                            {/* Add chart component here */}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportsDashboard; 