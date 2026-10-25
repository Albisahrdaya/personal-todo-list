
const express = require('express')
const router = express.Router()
const Task = require('../models/Task')

// GET: Retrieve all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST: Create a new task
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate || null,
      priority: req.body.priority || 'Medium',
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT: Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE: Remove a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
