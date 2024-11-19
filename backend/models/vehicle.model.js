import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: false
    },
    year: {
        type: Number,
        required: false
    },
    make: {
        type: String,
        enum: ['bmw', 'mercedes', 'audi', 'volkswagen', 'ford', 'chevrolet', 'chrysler', 'dodge', 'jeep', 'volvo', 'saab', 'porsche', 'lexus', 'mercury', 'buick', 'acura', 'lincoln', 'pontiac', 'honda', 'toyota', 'nissan', 'hyundai', 'kia', 'other'],
        required: false
    },
    model: {
        type: String,
        required: false
    },
    trim: {
        type: String,
        default: null
    },
    vin: {
        type: String,
        unique: true,
        sparse: true
    },
    licensePlate: {
        type: String,
        default: null
    },
    color: String,
    mileage: Number,
    engine: {
        type: String,
        enum: ['4-cylinder', '6-cylinder', '8-cylinder', 'electric'],
        required: false
    },
    turbooharged: {
        type: Boolean,
        default: false,
        required: false
    },
    transmission: {
        type: String,
        enum: ['automatic', 'manual', 'cvt'],
        required: false
    },
    fuelType: {
        type: String,
        enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
        required: false
    },
    isAWD: {
        type: Boolean,
        default: false
    },
    is4x4: {
        type: Boolean,
        default: false
    },
    notes: String,
    maintenanceHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRecord'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'in-service'],
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema); 