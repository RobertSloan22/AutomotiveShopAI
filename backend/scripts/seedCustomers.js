import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import dotenv from 'dotenv';

dotenv.config();

const seedCustomers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const customers = [
            { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
            // Add more test customers as needed
        ];

        await Customer.insertMany(customers);
        console.log('Test customers added successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding customers:', error);
        process.exit(1);
    }
};

seedCustomers(); 