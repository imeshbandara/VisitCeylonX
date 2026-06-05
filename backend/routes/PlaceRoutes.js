import express from 'express';
import Place from '../models/Place.js';

const router = express.Router();

// 1. GET ALL PLACES
router.get('/', async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET SINGLE PLACE BY ID
router.get('/:id', async (req, res) => {
  try {
    const placeId = req.params.id.trim();
    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: "Not found" });
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. POST NEW PLACE
router.post('/', async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. update a place
router.put('/:id', async (req, res) => {
  try {
    const placeId = req.params.id.trim();
    
    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Destination ID not found in database" });
    }

    res.status(200).json({ message: "Destination updated successfully! 🚀", data: updatedPlace });
  } catch (error) {
    res.status(400).json({ message: "Update crashed", error: error.message });
  }
});

export default router;