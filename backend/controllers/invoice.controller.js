import Customer from "../models/customer.model.js";
import Vehicle from "../models/vehicle.model.js";
import Invoice from "../models/invoice.model.js";

// Create a new invoice
export const createInvoice = async (req, res) => {
    try {
        // First, try to find existing customer by email
        let customer = await Customer.findOne({ email: req.body.customerEmail });
        
        if (customer) {
            // Update customer information if needed
            customer = await Customer.findByIdAndUpdate(
                customer._id,
                {
                    phoneNumber: req.body.phoneNumber || customer.phoneNumber,
                    address: req.body.address || customer.address,
                    city: req.body.city || customer.city,
                    zipCode: req.body.zipCode || customer.zipCode
                },
                { new: true }
            );
        } else {
            // Create new customer if doesn't exist
            customer = new Customer({
                firstName: req.body.customerName.split(' ')[0],
                lastName: req.body.customerName.split(' ').slice(1).join(' '),
                email: req.body.customerEmail,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                city: req.body.city,
                zipCode: req.body.zipCode
            });
            await customer.save();
        }

        // Check if vehicle exists for this customer
        let vehicle = await Vehicle.findOne({ 
            customerId: customer._id,
            vin: req.body.vehicleVin 
        });

        if (!vehicle) {
            // Create new vehicle
            vehicle = new Vehicle({
                customerId: customer._id,
                make: req.body.vehicleType.split(' ')[1], // Assuming format: "YEAR MAKE MODEL"
                model: req.body.vehicleType.split(' ')[2],
                year: parseInt(req.body.vehicleType.split(' ')[0]),
                vin: req.body.vehicleVin,
                color: req.body.vehicleColor,
                mileage: req.body.vehicleMileage,
                engine: req.body.vehicleEngine,
                transmission: req.body.vehicleTransmission,
                fuelType: req.body.vehicleFuelType
            });
            await vehicle.save();
        }

        // Create the invoice with references to customer and vehicle
        const newInvoice = new Invoice({
            ...req.body,
            customerId: customer._id,
            vehicleId: vehicle._id
        });

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error("Error in createInvoice: ", error);
        res.status(500).json({ error: "Error creating invoice" });
    }
};

// Get all invoices
export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        console.error("Error in getAllInvoices: ", error);
        res.status(500).json({ error: "Error fetching invoices" });
    }
};

// Get single invoice by ID
export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;

        // Handle special case for "recent"
        if (id === 'recent') {
            const recentInvoice = await Invoice.findOne()
                .sort({ createdAt: -1 })
                .populate('customer')
                .populate('vehicle')
                .populate('services')
                .populate('parts');

            if (!recentInvoice) {
                return res.status(404).json({ message: 'No invoices found' });
            }

            return res.status(200).json(recentInvoice);
        }

        // Handle regular ObjectId case
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid invoice ID format' });
        }

        const invoice = await Invoice.findById(id)
            .populate('customer')
            .populate('vehicle')
            .populate('services')
            .populate('parts');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error in getInvoiceById: ', error);
        res.status(500).json({ message: 'Error retrieving invoice', error: error.message });
    }
};

// Update invoice
export const updateInvoice = async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedInvoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }
        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error("Error in updateInvoice: ", error);
        res.status(500).json({ error: "Error updating invoice" });
    }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        console.error("Error in deleteInvoice: ", error);
        res.status(500).json({ error: "Error deleting invoice" });
    }
};

// Get invoices by customer email
export const getInvoicesByCustomer = async (req, res) => {
    try {
        const invoices = await Invoice.find({ customerId: req.params.id })
            .populate('vehicleId')
            .sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        console.error("Error in getInvoicesByCustomer: ", error);
        res.status(500).json({ error: "Error fetching customer invoices" });
    }
};

// write the getRecentInvoices function
export const getRecentInvoices = async (req, res) => {
    try {
        const recentInvoices = await Invoice.find()
            .sort({ date: -1 })
            .limit(5)
            .lean();
        res.status(200).json(recentInvoices);
    } catch (error) {
        console.error('Error in getRecentInvoices:', error);
        res.status(500).json({ error: 'Failed to fetch recent invoices' });
    }
};




