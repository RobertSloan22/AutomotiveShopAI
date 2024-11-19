import React from 'react'
import VehicleList from './VehicleList';
//import VehicleDetails from './VehicleDetails';
// from components/vehicles import vehicledetailsmodal
import VehicleDetailsModal from '../../components/vehicle/VehicleDetailsModal';
//from components/vehicle import vehicleSelectionmodal
import VehicleSelectionModal from '../../components/vehicles/VehicleSelectionModal';
import VehicleDetails from '../../components/vehicles/VehicleDetails';

const VehiclePage = () => {
  return (
    <>
    <div>
      <VehicleList />
    </div>
    <VehicleDetailsModal />
    <VehicleSelectionModal />
    </>
  )
}

export default VehiclePage
