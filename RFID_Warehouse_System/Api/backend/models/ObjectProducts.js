const mongoose = require('mongoose');
const ObjectProductSchema = new mongoose.Schema({
    batchNumber: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date},
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});
module.exports = mongoose.model('ObjectProduct', ObjectProductSchema);