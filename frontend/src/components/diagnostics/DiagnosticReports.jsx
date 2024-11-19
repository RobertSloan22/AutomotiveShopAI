import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';

const DiagnosticReports = () => {
    const { currentVehicle } = useCustomer();
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Diagnostic Reports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reports List */}
                <div className="lg:col-span-1 bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Reports</h3>
                    <div className="space-y-2">
                        {reports.map(report => (
                            <div
                                key={report._id}
                                onClick={() => setSelectedReport(report)}
                                className={`p-3 rounded cursor-pointer ${
                                    selectedReport?._id === report._id ?
                                    'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                            >
                                <p className="text-white font-medium">
                                    {report.title}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {new Date(report.date).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Report Details */}
                <div className="lg:col-span-2 bg-gray-700 rounded-lg p-4">
                    {selectedReport ? (
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">
                                {selectedReport.title}
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-2">
                                        Diagnostic Codes
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedReport.codes.map(code => (
                                            <div key={code.code} className="bg-gray-600 rounded p-3">
                                                <p className="text-white font-medium">
                                                    {code.code}
                                                </p>
                                                <p className="text-gray-400">
                                                    {code.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-2">
                                        Findings
                                    </h4>
                                    <p className="text-gray-300">
                                        {selectedReport.findings}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-2">
                                        Recommendations
                                    </h4>
                                    <ul className="list-disc list-inside text-gray-300">
                                        {selectedReport.recommendations.map((rec, index) => (
                                            <li key={index}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            Select a report to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiagnosticReports; 