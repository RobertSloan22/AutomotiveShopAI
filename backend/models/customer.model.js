import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    zipCode: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    preferredContact: {
        type: String,
        enum: ['email', 'phone', 'text'],
        default: 'email'
    }
}, {
    timestamps: true
});

// Add text index for search functionality
customerSchema.index({
    firstName: 'text',
    lastName: 'text',
    email: 'text',
    phoneNumber: 'text',
    address: 'text',
    city: 'text',
    zipCode: 'text'
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
