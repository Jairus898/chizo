const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET all payments
router.get('/', paymentController.getAllPayments);

// GET a single payment
router.get('/:id', paymentController.getPayment);

// POST a new payment
router.post('/', paymentController.createPayment);

// GET calculate fee for a parking record
router.get('/calculate/:parkingRecordId', paymentController.calculateFee);

module.exports = router;
