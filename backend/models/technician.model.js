import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    specialties: [String],
    certifications: [{
        name: String,
        issueDate: Date,
        expiryDate: Date
    }],
    status: {
        type: String,
        enum: ['active', 'on-leave', 'inactive'],
        default: 'active'
    },
    laborRate: Number
}, { timestamps: true });

export default mongoose.model('Technician', technicianSchema); 