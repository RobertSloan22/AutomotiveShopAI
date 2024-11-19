import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
// IMPORT APPOINTMENTS
import Appointments from "../appointments/Appointments";
// import the sidebar
import Sidebar from "../sidebar/Sidebar";
import { Drawer } from '@mui/material';

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [isOpen, setIsOpen] = useState(false);

	// Open drawer when conversation is selected
	useEffect(() => {
		if (selectedConversation) {
			setIsOpen(true);
		}
	}, [selectedConversation]);

	// Handle drawer close
	const handleClose = () => {
		setIsOpen(false);
		setSelectedConversation(null);
	};

	return (
		<>
			{/* Fixed Sidebar */}
			<div className={`
				fixed 
				right-0 
				top-0 
				h-screen 
				w-64
				bg-gray-800 
				text-white 
				z-50
				border-l 
				border-slate-500
			`}>
				<Sidebar onConversationSelect={() => setIsOpen(true)} />
			</div>

			{/* Off-canvas message area */}
			<Drawer
				anchor="top"
				open={isOpen && selectedConversation !== null}
				onClose={handleClose}
				PaperProps={{
					sx: {
						width: 'calc(100% - 256px)', // Full width minus sidebar width
						height: '80vh',
						bgcolor: 'rgb(31 41 55)',
						marginLeft: 'auto',
						marginRight: '256px', // Same as sidebar width
					},
				}}
			>
				<div className="h-full flex flex-col text-white">
					{/* Header */}
					<div className='bg-slate-500 px-4 py-2 flex justify-between items-center'>
						<div>
							<span className='label-text'>To:</span>{" "}
							<span className='text-gray-900 font-bold'>
								{selectedConversation?.fullName}
							</span>
						</div>
						<button 
							onClick={handleClose}
							className="text-gray-200 hover:text-white"
						>
							×
						</button>
					</div>

					{/* Messages Area */}
					<div className="flex-1 overflow-y-auto">
						<Messages />
					</div>

					{/* Message Input */}
					<div className="p-4 bg-gray-900">
						<MessageInput />
					</div>
				</div>
			</Drawer>
		</>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome {authUser.fullName} </p>
				<p>Harlem Division Auto Repair Conversations</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};


