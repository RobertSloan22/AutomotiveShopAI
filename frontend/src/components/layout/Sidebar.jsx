import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { 
    FaChartLine, 
    FaCalendarAlt, 
    FaUsers, 
    FaCar,
    FaFileInvoice,
    FaTools,
    FaBoxes,
    FaUserCog,
    FaChartBar,
    FaComments,
    FaSearch,
    FaThLarge,
    FaHome
} from 'react-icons/fa';
// menu items needs to include the path for invoice, profile, HOME 
// The log out feature and button need to work 

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const { authUser } = useAuthContext();

    const menuItems = [
        {
            path: '/unified-dashboard',
            name: 'Unified Dashboard',
            icon: <FaThLarge className="w-5 h-5" />
        },
        { path: '/dashboard', label: 'Overview', icon: <FaChartLine className="w-5 h-5" /> },
        { path: '/appointments', label: 'Appointments', icon: <FaCalendarAlt className="w-5 h-5" /> },
        { path: '/customers', label: 'Customers', icon: <FaUsers className="w-5 h-5" /> },  
        { path: '/reports', label: 'Reports', icon: <FaChartBar className="w-5 h-5" /> },
        { path: '/invoice', label: 'Invoice', icon: <FaFileInvoice className="w-5 h-5" /> },
        { path: '/home', label: 'DTC Query', icon: <FaHome className="w-5 h-5" /> },
        { path: '/dtc-query-interface', label: 'Chat Assistant', icon: <FaSearch className="w-5 h-5" /> },
        { path: '/profile', label: 'Profile', icon: <FaUserCog className="w-5 h-5" /> }
    ];

    return (
        <div className={`
            fixed 
            left-0 
            top-0 
            h-screen 
            text-white 
            w-64
            transition-all 
            duration-300 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-56'}
            z-50
        `}>
            <div className="h-full  flex flex-col">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-4 top-4 bg-gray-800 p-2 rounded-full"
                >
                    {isSidebarOpen ? '◀️' : '▶️'}
                </button>
                <nav className="flex-1 space-y-2 p-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors w-full max-w-[100px] ${
                                location.pathname === item.path ? 'bg-gray-700' : ''
                            }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {isSidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600" />
                        {isSidebarOpen && authUser && (
                            <div className="ml-3">
                                <p className="text-white">{authUser.fullName}</p>
                                <p className="text-gray-400 text-sm">{authUser.username}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 