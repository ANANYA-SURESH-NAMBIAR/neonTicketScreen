 
const Payment = require("../models/Payment");

const createPayment = async (req, res) => {
  const payment = await Payment.create(req.body);
  res.json(payment);
};

const getPayment = async (req, res) => {
  const data = await Payment.findById(req.params.id);
  res.json(data);
};

module.exports = { createPayment, getPayment };
