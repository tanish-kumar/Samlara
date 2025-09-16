
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  address: {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: { type: String, enum: ['COD','QR'], required: true },
  status: { type: String, default: 'PLACED' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
