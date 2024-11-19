import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TechnicianDashboard = () => {
    const [technicians, setTechnicians] = useState([]);
    const [assignments, setAssignments] = useState({});

    const handleDragEnd = (result) => {
        // Handle drag and drop logic for job assignments
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Technician Assignments</h2>
            
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {technicians.map(tech => (
                        <Droppable key={tech._id} droppableId={tech._id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-700 rounded-lg p-4"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        {tech.name}
                                    </h3>
                                    
                                    {assignments[tech._id]?.map((job, index) => (
                                        <Draggable
                                            key={job._id}
                                            draggableId={job._id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-gray-600 rounded p-3 mb-3"
                                                >
                                                    <p className="text-white">{job.description}</p>
                                                    <div className="flex justify-between text-sm text-gray-400">
                                                        <span>{job.estimatedTime}h</span>
                                                        <span>{job.status}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default TechnicianDashboard; 