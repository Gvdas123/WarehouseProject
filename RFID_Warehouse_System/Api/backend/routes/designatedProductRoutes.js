const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DesignatedProduct = require('../models/DesignatedProduct');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get('/project/:projectId', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.projectId)) {
            return res.status(400).json({ error: "Invalid project ID" });
        }

        const products = await DesignatedProduct.find({ 
            projectId: req.params.projectId 
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/exists', async (req, res) => {
    try {
        const { projectId, batchNumber } = req.query;
        
        if (!isValidObjectId(projectId)) {
            return res.status(400).json({ error: "Invalid project ID" });
        }

        const exists = await DesignatedProduct.exists({
            projectId,
            batchNumber
        });
        res.json(exists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
  try {
      const { batchNumber, amount, nameLastname, projectId } = req.body;
      
      if (!batchNumber || !amount || !nameLastname || !projectId) {
          return res.status(400).json({ 
              error: "Missing required fields",
              required: ["batchNumber", "amount", "nameLastname", "projectId"]
          });
      }

      if (!isValidObjectId(projectId)) {
          return res.status(400).json({ error: "Invalid project ID" });
      }

      const newProduct = new DesignatedProduct({
          batchNumber,
          amount: Number(amount),
          nameLastname,
          projectId,
          date: req.body.date || new Date()
      });

      await newProduct.save();
      res.status(201).json(newProduct);
  } catch (err) {
      res.status(400).json({ 
          error: "Validation failed",
          details: err.message,
          receivedBody: req.body
      });
  }
});

router.patch('/amount', async (req, res) => {
    try {
        const { batchNumber, amount, projectId } = req.body;
        
        if (!isValidObjectId(projectId)) {
            return res.status(400).json({ error: "Invalid project ID" });
        }

        const updated = await DesignatedProduct.findOneAndUpdate(
            { batchNumber, projectId },
            { $inc: { amount } },
            { new: true }
        );
        
        if (!updated) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get('/', async (req, res) => {
    try {
      const products = await DesignatedProduct.find()
        .populate('projectId', 'name')
        .exec();
      const transformedProducts = products.map(product => ({
        ...product._doc,
        projectName: product.projectId?.name || 'Unknown Project'}));
      res.json(transformedProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const deletedProduct = await DesignatedProduct.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(deletedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;