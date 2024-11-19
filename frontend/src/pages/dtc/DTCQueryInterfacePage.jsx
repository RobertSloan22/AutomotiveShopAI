import React from 'react'
import DTCQueryInterface from '../../components/dtc/DTCQueryInterface'
import MessageContainer from '../../components/messages/MessageContainer'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';

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
    position: 'relative',
    '& .dtc-container': {
      position: 'relative',
      zIndex: 9999,
    },
    '& .console-container': {
      position: 'relative',
      zIndex: 1,
    },
  }));
const DTCQueryInterfacePage = () => {
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
    </Item>
  </Box>

  <Box sx={{ gridColumn: 'span 12' }}>
 
  </Box>
  <Box sx={{ gridColumn: 'span 12' }}>
    <Item>
      <div className="console-container">
      </div>
    </Item>
  </Box>
  
</Box>
    </>
  )
}

export default DTCQueryInterfacePage
