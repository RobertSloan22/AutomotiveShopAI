import Customer from '../models/customer.model.js';
import Vehicle from '../models/vehicle.model.js';
import Invoice from '../models/invoice.model.js';

export const createCustomer = async (req, res) => {
    try {
        console.log('Received create customer request:', req.body);
        
        // Extract customer data from either nested or flat structure
        const customerData = req.body.customerData || req.body;
        
        // Validate required fields
        if (!customerData.firstName || !customerData.lastName) {
            return res.status(400).json({ 
                error: 'First name and last name are required',
                receivedData: customerData
            });
        }

        // Create customer
        const customer = new Customer({
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email || '',
            phoneNumber: customerData.phoneNumber || '',
            address: customerData.address || '',
            city: customerData.city || '',
            zipCode: customerData.zipCode || '',
            notes: customerData.notes || ''
        });

        await customer.save();
        console.log('Customer created successfully:', customer);

        // Handle vehicle data if provided
        if (req.body.vehicleData && Object.keys(req.body.vehicleData).length > 0) {
            const vehicleData = {
                customerId: customer._id,
                ...req.body.vehicleData
            };
            const vehicle = new Vehicle(vehicleData);
            await vehicle.save();
            console.log('Vehicle created successfully:', vehicle);
        }

        res.status(201).json({
            message: 'Customer created successfully',
            customer: customer
        });
    } catch (error) {
        console.error('Customer Creation Error:', error);
        res.status(400).json({ 
            error: error.message,
            details: error.errors
        });
    }
};
export const searchCustomers = async (req, res) => {
    try {
        const { term } = req.query;
        
        if (!term) {
            return res.status(400).json({ error: 'Search term required' });
        }

        // Split the search term to handle "LastName, FirstName" format
        const parts = term.split(',').map(part => part.trim());
        
        let searchQuery;
        if (parts.length === 2) {
            // If comma is present, assume "LastName, FirstName" format
            searchQuery = {
                $and: [
                    { lastName: new RegExp(parts[0], 'i') },
                    { firstName: new RegExp(parts[1], 'i') }
                ]
            };
        } else {
            // Otherwise, search across all relevant fields
            searchQuery = {
                $or: [
                    { firstName: new RegExp(term, 'i') },
                    { lastName: new RegExp(term, 'i') },
                    { email: new RegExp(term, 'i') },
                    { phoneNumber: new RegExp(term, 'i') },
                    { address: new RegExp(term, 'i') }
                ]
            };
        }

        const customers = await Customer.find(searchQuery)
            .limit(10)
            .select('firstName lastName email phoneNumber address city zipCode preferredContact');
            
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            city: req.body.city,
            zipCode: req.body.zipCode,
            notes: req.body.notes
        };

        const customer = await Customer.findByIdAndUpdate(
            customerId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateCustomerWithVehicle = async (req, res) => {
    try {
        const customerId = req.params.id;
        const { customerData, vehicleData } = req.body;

        // Update customer
        const customer = await Customer.findByIdAndUpdate(
            customerId,
            {
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                email: customerData.email,
                phoneNumber: customerData.phoneNumber,
                address: customerData.address,
                city: customerData.city,
                zipCode: customerData.zipCode,
                notes: customerData.notes
            },
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Handle vehicle update/creation
        let vehicle;
        if (vehicleData._id) {
            // Update existing vehicle
            vehicle = await Vehicle.findByIdAndUpdate(
                vehicleData._id,
                {
                    year: vehicleData.year,
                    make: vehicleData.make,
                    model: vehicleData.model,
                    trim: vehicleData.trim,
                    vin: vehicleData.vin,
                    licensePlate: vehicleData.licensePlate,
                    color: vehicleData.color,
                    mileage: vehicleData.mileage,
                    engine: vehicleData.engine,
                    transmission: vehicleData.transmission,
                    fuelType: vehicleData.fuelType,
                    isAWD: vehicleData.isAWD,
                    is4x4: vehicleData.is4x4,
                    notes: vehicleData.notes
                },
                { new: true }
            );
        } else if (vehicleData.make && vehicleData.model) {
            // Create new vehicle
            vehicle = new Vehicle({
                ...vehicleData,
                customerId: customer._id
            });
            await vehicle.save();
        }

        res.json({
            customer: customer.toObject(),
            vehicle: vehicle ? vehicle.toObject() : null
        });
    } catch (error) {
        console.error('Error in updateCustomerWithVehicle:', error);
        res.status(400).json({ error: error.message });
    }
};

export const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCustomerVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ customerId: req.params.id });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCustomerInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ customerId: req.params.id });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Delete associated vehicles
        await Vehicle.deleteMany({ customerId: req.params.id });
        
        // Delete associated invoices
        await Invoice.deleteMany({ customerId: req.params.id });

        res.json({ message: 'Customer and associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};