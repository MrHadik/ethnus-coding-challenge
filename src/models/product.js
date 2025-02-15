const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  dateOfSale: { type: Date, required: true },
  sold: { type: Boolean, required: true }
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
