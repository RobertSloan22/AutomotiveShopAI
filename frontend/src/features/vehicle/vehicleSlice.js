// create a vehicleSlice to manage the vehicles state

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    vehicles: [],
}

export const vehicleSlice = createSlice({
    name: 'vehicles',
    initialState,
});

export default vehicleSlice.reducer;
