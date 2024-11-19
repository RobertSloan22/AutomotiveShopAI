import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { VehicleProvider } from './context/VehicleContext';
import ShopDashboard from './components/layout/ShopDashboard';
import Overview from './pages/dashboard/Overview';
import Login from './pages/login/Login';
import SignUp from './pages/auth/SignUp';
import { Toaster } from "react-hot-toast";
import { CustomerProvider } from './context/CustomerContext';
import Home from './pages/home/Home';
import MessageContainer from './components/messages/MessageContainer';
import DTCQueryInterface from './components/dtc/DTCQueryInterface';
import DTCQueryInterfacePage from './pages/dtc/DTCQueryInterfacePage';
import Activant from './pages/activant/Activant';
import AppointmentRoutes from './routes/AppointmentRoutes';
import CustomerRoutes from './routes/CustomerRoutes';
import VehicleRoutes from './routes/VehicleRoutes';
import ServiceRoutes from './routes/ServiceRoutes';
import PartsRoutes from './routes/PartsRoutes';
import TechnicianRoutes from './routes/TechnicianRoutes';
import ReportRoutes from './routes/ReportRoutes';
import Profile from './pages/profile/Profile';
import NewInvoice from './pages/invoice/NewInvoice';
import Invoice from './pages/invoice/Invoice';
import EditCustomer from './components/customers/EditCustomer';
import NewCustomer from './components/customers/NewCustomer';
// import navbarimport 
import UnifiedDashboard from './pages/dashboard/UnifiedDashboard';
//import customers from src/pages/customers
import Customers from './pages/customers/Customers'
import CustomersPage from './pages/customers/CustomersPage';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/layout/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InvoiceProvider } from './context/InvoiceContext';

function App() {
	const { authUser } = useAuthContext();

	return (
		<>
		<CustomerProvider>
			<VehicleProvider>
				<InvoiceProvider>
					<div className='p-4 h-screen flex items-center justify-center'>
						<Routes>
							{/* Public Routes */}
							<Route path="/" element={!authUser ? <Navigate to="/login" /> : <Navigate to="/dashboard" />} />
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<SignUp />} />

							{/* Protected Routes */}
							<Route
								path="/*"
								element={
									authUser ? (
										<ShopDashboard>
										<MessageContainer />
											<Routes>
												<Route path="/unified-dashboard" element={<UnifiedDashboard />} />
												<Route path="/customers/*" element={<CustomerRoutes />} />
												<Route path="/profile" element={<Profile />} />
												<Route path="/activant" element={<Activant />} />
												<Route path="/dashboard" element={<Overview />} />
												<Route path="/appointments/*" element={<AppointmentRoutes />} />
												<Route path="/vehicles/*" element={<VehicleRoutes />} />
												<Route path="/invoice" element={<Invoice />} />
												<Route path="/dtc-query-interface" element={<DTCQueryInterfacePage />} />	
												<Route path="/service-records/*" element={<ServiceRoutes />} />
												<Route path="/parts/*" element={<PartsRoutes />} />
												<Route path="/technicians/*" element={<TechnicianRoutes />} />
												<Route path="/reports/*" element={<ReportRoutes />} />
												<Route path="/home" element={<Home />} />													
												<Route path="/messages" element={<MessageContainer />} />
												<Route path="/dtc-query" element={<DTCQueryInterface />} />
												<Route path="/" element={<Navigate to="/dashboard" replace />} />
												<Route path="/customers/new" element={<NewCustomer />} />
												<Route path="/customers/:id/edit" element={<Home />} />
											</Routes>
										</ShopDashboard>
									) : (
										<Navigate to="/login" replace />
									)
								}
							/>
						</Routes>
						<Toaster />
						<ToastContainer 
							position="top-right"
							autoClose={3000}
							hideProgressBar={false}
							newestOnTop
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme="dark"
						/>
					</div>
				</InvoiceProvider>
			</VehicleProvider>
		</CustomerProvider>
		</>
	);
}

export default App;