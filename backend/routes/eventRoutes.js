import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// 1. GET ALL EVENTS
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET SINGLE EVENT BY ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id.trim());
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. POST NEW EVENT
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🛠️ 4. PUT REQUEST FOR UPDATE 
router.put('/:id', async (req, res) => {
  try {
    const eventId = req.params.id.trim();
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found to update" });
    }

    res.status(200).json({ message: "Event assets updated successfully! 🎪✨", data: updatedEvent });
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
});

export default router;