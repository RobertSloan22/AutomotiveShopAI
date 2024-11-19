import Vehicle from '../models/vehicle.model.js';
import Customer from '../models/customer.model.js';

export const createVehicle = async (req, res) => {
    try {
        if (!req.body.customerId) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

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
// get all vehicles in the database     
export const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// add a route to get all vehicles for a customer by customer name 
export const getAllVehiclesForCustomer = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ customerId: req.params.customerId });
        res.json(vehicles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// write a route to get recent vehicles from the recent invoices route
export const getRecentVehicles = async (req, res) => {
    try {
        const recentVehicles = await Vehicle.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        res.status(200).json(recentVehicles);
    } catch (error) {
        console.error('Error in getRecentVehicles:', error);
        res.status(500).json({ error: 'Failed to fetch recent vehicles' });
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

export const getVehiclesByCustomerName = async (req, res) => {
    try {
        const { firstName, lastName } = req.query;
        
        // Find customers matching the name
        const customers = await Customer.find({
            firstName: new RegExp(firstName, 'i'),
            lastName: new RegExp(lastName, 'i')
        });

        if (!customers.length) {
            return res.status(404).json({ error: 'No customers found with that name' });
        }

        // Get customer IDs
        const customerIds = customers.map(customer => customer._id);

        // Find vehicles for these customers
        const vehicles = await Vehicle.find({
            customerId: { $in: customerIds }
        }).populate('customerId', 'firstName lastName');

        res.json(vehicles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};