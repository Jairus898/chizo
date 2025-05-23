const Payment = require('../models/Payment');
const ParkingRecord = require('../models/ParkingRecord');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single payment
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { parkingRecordId, amountPaid } = req.body;
    
    // Check if parking record exists and is completed
    const parkingRecord = await ParkingRecord.findById(parkingRecordId);
    if (!parkingRecord) {
      return res.status(404).json({ message: 'Parking record not found' });
    }
    
    if (parkingRecord.status !== 'Completed') {
      return res.status(400).json({ message: 'Cannot create payment for active parking record' });
    }
    
    // Check if payment already exists for this record
    const existingPayment = await Payment.findOne({ parkingRecordId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this parking record' });
    }
    
    const newPayment = new Payment({
      parkingRecordId,
      amountPaid,
      paymentDate: new Date()
    });
    
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate parking fee
exports.calculateFee = async (req, res) => {
  try {
    const { parkingRecordId } = req.params;
    
    const parkingRecord = await ParkingRecord.findById(parkingRecordId);
    if (!parkingRecord) {
      return res.status(404).json({ message: 'Parking record not found' });
    }
    
    if (parkingRecord.status !== 'Completed') {
      return res.status(400).json({ message: 'Cannot calculate fee for active parking record' });
    }
    
    // Calculate fee based on duration (in minutes)
    // Base rate: 500 RWF per hour, minimum 1 hour
    const hourlyRate = 500;
    const hours = Math.ceil(parkingRecord.duration / 60);
    const fee = hours * hourlyRate;
    
    res.status(200).json({ 
      parkingRecordId,
      duration: parkingRecord.duration,
      hours,
      fee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
