import Vehicle from '../models/vehicle.model.js';

export const createVehicle = async (req, res) => {
    try {
        const vehicleData = {
            customerId: req.body.customerId,
            year: req.body.year,
            make: req.body.make,
            model: req.body.model,
            trim: req.body.trim,
            vin: req.body.vin,
            licensePlate: req.body.licensePlate,
            color: req.body.color,
            mileage: req.body.mileage,
            engine: req.body.engine,
            transmission: req.body.transmission,
            fuelType: req.body.fuelType,
            isAWD: req.body.isAWD,
            is4x4: req.body.is4x4,
            notes: req.body.notes,
            status: req.body.status || 'active'
        };

        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Vehicle Creation Error:', error);
        res.status(400).json({ 
            error: error.message,
            details: error.errors
        });
    }
};

export const getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getCustomerVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ customerId: req.params.customerId });
        res.json(vehicles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getVehicleServiceHistory = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate({
                path: 'maintenanceHistory',
                options: { sort: { 'serviceDate': -1 } }
            });
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        res.json(vehicle.maintenanceHistory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};