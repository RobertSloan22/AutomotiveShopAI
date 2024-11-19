import { Grid, Container, AppBar, Toolbar } from '@mui/material';
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";
import StatsGrid from "../../components/dashboard/StatsGrid";
// import invoice and new invoice from invoice folder
import InvoiceContainer from "../invoice/Invoice";
import NewInvoice from "../invoice/NewInvoice";
// import service list from service folder
import ServiceList from "../services/ServiceList";
import { ConsolePage } from '../../components/assistant/ConsolePage'
//import { VoiceAssistant } from '../../components/assistant/VoiceAssistant'
import './profile.css'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


// import grid, item and gridcontainer from npm install @mui/material @emotion/react @emotion/styled
// use a grid to lay out the page
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    ...theme.applyStyles('dark', {
    }),
  }));
 

// import engine diagram from assistant folder

const Profile = () => {
	return (
		<>
		<div className="profile-container h-[100vh]">
		<Box>	
				<Item>
				<StatsGrid />
				</Item>
				</Box>
				<Box>	
				<Item>
				<ConsolePage />
				</Item>
				</Box>
		</div>


		</>

	);
};

export default Profile;
