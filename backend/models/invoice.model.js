import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
	{
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
			required: true
		},
		vehicleId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vehicle',
			required: true
		},
		customerName: {
			type: String,
			required: true,
		},
		customerEmail: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},  
		invoiceDate: {
			type: Date,
			required: true,
		},
        vehicleType: {
			type: String,
			required: true,
		},  
		vehicleNumber: {
			type: String,
			required: true,
		},
        vehicleVin: {
			type: String,
			required: true,
		},
		vehicleColor: {
			type: String,
			required: true,
		},
		vehicleMileage: {
			type: String,
			required: true,
		},
		vehicleEngine: {
			type: String,
			required: true,
		},
		vehicleTransmission: {
			type: String,
			required: true,
		},  
		vehicleFuelType: {
			type: String,
			required: true,
		},  
		vehicleDescription: {
			type: String,
			required: true,
		},      
		// createdAt, updatedAt => Member since <createdAt>
	},
	{ timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
