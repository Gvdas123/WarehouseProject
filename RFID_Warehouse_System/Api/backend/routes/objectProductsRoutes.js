const express = require('express');
const router = express.Router();
const ObjectProduct = require('../models/ObjectProducts');

router.post('/:projectId', async (req, res) => {
  try {
    const product = new ObjectProduct({
      ...req.body,
      projectId: req.params.projectId,
      date: req.body.date || new Date()
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/project/:projectId', async (req, res) => {
  try {
    const products = await ObjectProduct.find({ projectId: req.params.projectId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch('/:id', async (req, res) => {
  try {
    if (req.body.projectId) delete req.body.projectId;
    
    const updated = await ObjectProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ObjectProduct.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;