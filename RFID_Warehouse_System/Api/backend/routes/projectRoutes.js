const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.post('/', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const projects = await Project.find({status : true});
    res.json(projects);
});
router.get('/all', async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: "Invalid project ID" });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Invalid project ID" });
    }
});

router.patch('/:id', async (req, res) => { 
    try {
        const project = await Project.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});
module.exports = router;