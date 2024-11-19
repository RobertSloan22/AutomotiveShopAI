import mongoose from 'mongoose';

const partSchema = new mongoose.Schema({
    partNumber: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    manufacturer: String,
    price: {
        type: Number,
        required: true
    },
    cost: Number,
    quantity: {
        type: Number,
        default: 0
    },
    minimumStock: {
        type: Number,
        default: 1
    },
    location: String,
    suppliers: [{
        name: String,
        supplierPartNumber: String,
        cost: Number
    }]
}, { timestamps: true });

export default mongoose.model('Part', partSchema); 