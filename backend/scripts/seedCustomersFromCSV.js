import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/customer.model.js';
import Vehicle from '../models/vehicle.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, '../../filename.csv');

const processCustomerName = (fullName) => {
    const parts = fullName.split(',');
    if (parts.length === 2) {
        return {
            lastName: parts[0].trim(),
            firstName: parts[1].trim()
        };
    }
    // Fallback if no comma found
    const spaceParts = fullName.split(' ');
    return {
        firstName: spaceParts[0],
        lastName: spaceParts.slice(1).join(' ') || 'Unknown'
    };
};

const generateTempEmail = (firstName, lastName, index) => {
    const sanitizedFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const sanitizedLast = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${sanitizedFirst}.${sanitizedLast}.${index}@placeholder.com`;
};

const processCSV = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/your_database_name');
        console.log('Connected to MongoDB');

        const customerMap = new Map();
        const results = [];

        // Read CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        console.log(`Read ${results.length} records from CSV`);

        for (const [index, row] of results.entries()) {
            try {
                const { firstName, lastName } = processCustomerName(row.customer);
                const customerKey = `${firstName}-${lastName}-${row.address}`;

                if (!customerMap.has(customerKey)) {
                    // Create customer with all possible fields
                    const customer = new Customer({
                        firstName,
                        lastName,
                        email: generateTempEmail(firstName, lastName, index),
                        phoneNumber: row.phoneNumber || '000-000-0000',
                        address: row.address,
                        city: row.city,
                        zipCode: row.zip,
                        notes: '',
                        preferredContact: 'email'
                    });

                    await customer.save();
                    console.log(`Created customer: ${firstName} ${lastName}`);

                    // Create default vehicle entry
                    const vehicle = new Vehicle({
                        customerId: customer._id,
                        year: null,
                        make: 'other',
                        model: 'unknown',
                        trim: null,
                        vin: null,
                        licensePlate: null,
                        color: null,
                        mileage: null,
                        engine: '4-cylinder',
                        transmission: 'automatic',
                        fuelType: 'gasoline',
                        isAWD: false,
                        is4x4: false,
                        notes: 'Created from historical import',
                        status: 'active'
                    });

                    await vehicle.save();
                    console.log(`Created default vehicle for customer: ${firstName} ${lastName}`);

                    customerMap.set(customerKey, {
                        customerId: customer._id,
                        vehicleId: vehicle._id
                    });
                }

                // Create service record if needed
                if (row['Item Description']) {
                    const { customerId, vehicleId } = customerMap.get(customerKey);
                    // Here you could add logic to create service records
                    // using the ServiceRecord model
                }
            } catch (error) {
                console.error(`Error processing row:`, row, error);
                continue;
            }
        }

        console.log('Data import completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

processCSV();