import mongoose from 'mongoose';
import Place from '../models/Place.js';

// GET single place data from database
export const getPlaceById = async (req, res) => {
  try {
    const placeId = req.params.id.trim();

    // Check if the ID provided is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Database Identifier Format"
      });
    }

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({
        message: "Destination details not found in database"
      });
    }

    // Return data back to React frontend
    return res.status(200).json(place);

  } catch (error) {
    return res.status(500).json({
      message: "Database link dropped",
      error: error.message
    });
  }
};