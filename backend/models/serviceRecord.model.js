import mongoose from 'mongoose';

const serviceRecordSchema = new mongoose.Schema({
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
    serviceDate: {
        type: Date,
        required: true
    },
    serviceType: {
        type: String,
        enum: ['maintenance', 'repair', 'diagnostic', 'inspection', 'oil-change', 'tire-rotation', 'detailing', 'Coolantflush', 'transmission-flush', 'Air-conditioning', 'suspension', 'performance', 'electrical', 'other'],
        required: true
    },
    mileage: Number,
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician'
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'diagnosed', 'waiting-for-approval', 'waiting-parts', 'cancelled'],
        default: 'scheduled'
    },
    parts: [{
        partId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Part'
        },
        quantity: Number,
        price: Number
    }],
    labor: [{
        description: String,
        hours: Number,
        rate: Number
    }],
    totalCost: Number,
    notes: String,
    diagnosticCodes: [{
        code: String,
        description: String
    }],
    recommendations: [{
        service: String,
        priority: {
            type: String,
            enum: ['high', 'medium', 'low', 'needed-now']
        },
        estimatedCost: Number
    }]
}, { timestamps: true });

export default mongoose.model('ServiceRecord', serviceRecordSchema); 