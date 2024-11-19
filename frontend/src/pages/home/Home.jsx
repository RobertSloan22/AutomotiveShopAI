import MessageContainer from "../../components/messages/MessageContainer";
import Appointments from "../../components/appointments/Appointments";
import NewCustomerForm from "../../components/customers/NewCustomerForm";
import InvoiceList from "../invoice/Invoice";
import VehicleDetailsModal from "../../components/vehicle/VehicleDetailsModal";
// from components/customers/NewCustomerForm
import CustomerForm from '../../components/customers/CustomerForm';
import EditCustomer from '../../components/customers/EditCustomer';
import NewCustomer from '../../components/customers/NewCustomer';
import UnifiedDashboard from '../dashboard/UnifiedDashboard';
import StatsGrid from '../../components/dashboard/StatsGrid';
import QuickActions from '../../components/dashboard/QuickActions';
import DTCQueryInterface from '../../components/dtc/DTCQueryInterface';
// import Container and Grid from @mui/material
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { ConsolePage } from '../../components/assistant/ConsolePage';


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
const Home = () => {
    return (
        <>
     <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
  <Box sx={{ gridColumn: 'span 8' }}>
    <Item>xs=8</Item>
  </Box>
  <Box sx={{ gridColumn: 'span 4' }}>
    <Item>xs=4</Item>
  </Box>
  <Box sx={{ gridColumn: 'span 2' }}>
    <Item>xs=4
    </Item>
  </Box>
  <Box sx={{ gridColumn: 'span 1' }}>
    <Item>xs=4
    
    </Item>
  </Box>
  <Box sx={{ gridColumn: 'span 6' }}>
    <Item>xs=4
    <StatsGrid />
    </Item>
  </Box>
  <Box sx={{ gridColumn: 'span 8' }}>
    <Item>xs=8</Item>
  </Box>
  <Box sx={{ gridColumn: 'span 8' }}>
    <Item>xs=8</Item>
  </Box>
  <Box sx={{ gridColumn: 'span 4' }}>
    <Item>xs=4</Item>
  </Box>
  <Box sx={{ gridColumn: 'span 2' }}>
    <Item>xs=4
    </Item>
  </Box>

  
  <Box sx={{ gridColumn: 'span 10' }}>
    <Item>
    <DTCQueryInterface />
    </Item>
  </Box>
  
</Box>
<div>
   
</div>
        </>
    );
};

export default Home;
