const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  images: { type: String, required: true },
  tag: String,
  sizes: [{ type: String }],

  // ADD THESE FIELDS to support your seed data
  desc: String,
  rw1_name: String,
  rw1: String,
  rw2_name: String,
  rw2: String,
  rw3_name: String,
  rw3: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
