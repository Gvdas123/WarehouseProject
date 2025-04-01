const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

router.get('/:barcode', async (req, res) => {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
});

module.exports = router;