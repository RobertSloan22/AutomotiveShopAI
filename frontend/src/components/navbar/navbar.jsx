import React from 'react';
import { Link } from "react-router-dom";
import CustomerSearch from "../customers/CustomerSearch";
import VehicleIndicator from "./VehicleIndicator";
import DTCQueryInterface from '../dtc/DTCQueryInterface';
import "./nav.css";

const Navbar = () => {
	return (
		<>
		<nav className="bg-gray-800 p-4">
			<div className="flex items-center justify-between">
				<Link to="/" className="text-white font-bold">
					Harlem Division Auto Repair
				</Link>

				{/* Center section with vehicle/customer indicator */}
				<div className="flex-1 flex justify-center mx-4">
					<VehicleIndicator />
				</div>

				{/* Right section */}
				<div className="flex items-center space-x-4">
					<CustomerSearch />
					<div className="space-x-4">
						<Link to="/unified-dashboard" className="text-gray-300 hover:text-white">
							Home Dashboard
						</Link>
						
						<Link to="/activant" className="text-gray-300 hover:text-white">
							Appointments
						</Link>
						<Link to="/dtc-query-interface" className="text-gray-300 hover:text-white">
							DTC-Query-Interface
						</Link>
					</div>
				</div>
			</div>
		</nav>
		</>
	);
};

export default Navbar;
