import fs from 'fs';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Create Customer Schema
const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  zip: String,
  serviceHistory: [{
    date: Date,
    invoice: String,
    serviceType: String,
    amount: Number
  }]
});

customerSchema.index({ 
  name: 'text', 
  address: 'text'
});

const Customer = mongoose.model('Customer', customerSchema);

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_DB_URI);

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(join(__dirname, '../../filename.csv'))
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

  for await (const record of parser) {
    // Group services by customer
    const existingCustomer = records.find(r => 
      r.name === record['customer'] && 
      r.address === record['address']
    );

    const serviceEntry = {
      date: new Date(record['Date']),
      invoice: record['invoice'],
      serviceType: record['Item Description'],
      amount: parseFloat(record['Amount'].replace(',', ''))
    };

    if (existingCustomer) {
      existingCustomer.serviceHistory.push(serviceEntry);
    } else {
      records.push({
        name: record['customer'],
        address: record['address'],
        city: record['city'],
        zip: record['zip'],
        serviceHistory: [serviceEntry]
      });
    }
  }

  // Save to database
  try {
    await Customer.insertMany(records);
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
  
  await mongoose.connection.close();
};

processFile().catch(console.error);
