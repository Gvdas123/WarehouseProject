const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    barcode: { type: String, required: true, unique: true },
    batchNumber: { type: String, required: true },
    amount: { type: Number, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);