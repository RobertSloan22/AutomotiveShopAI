import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ServiceCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo);
        // Open appointment creation modal
    };

    const handleSelectEvent = (event) => {
        // Open appointment details modal
    };

    return (
        <div className="h-[600px] bg-gray-800 rounded-lg p-4">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                className="text-white"
            />
        </div>
    );
};

export default ServiceCalendar; 