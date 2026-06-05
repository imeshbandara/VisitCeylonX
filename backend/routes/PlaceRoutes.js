import express from 'express';
import Place from '../models/Place.js'; // Import the model safely

const router = express.Router();

/* 1. DATABASE EKE SIYALUMA STHANA LABAGENA 
      FRONTEND EKATA EWIMA (GET ALL) */
router.get('/', async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* 2. CLICK KARAPU CARD EKE ID EKATA ADALA VISTHARA 
      VITHARAK LABAGENA FRONTEND EKATA EWIMA (GET BY ID) */
router.get('/:id', async (req, res) => {
  try {
    // URL parameter එකෙන් එන ID එක පිරිසිදු කර ගැනීම (.trim())
    const placeId = req.params.id.trim();

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: "Destination details not found in MongoDB database" });
    }

    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "Server Database error", error: error.message });
  }
});

/* 3. POSTMAN HARAHAA HO USER KENEK ALUTH PLACE EKAK 
      ATHULATH KARAMA EKA DATABASE EKE THANPATH KIRIMA (POST) */
router.post('/', async (req, res) => {
  
  const { name, description, location, district, category, image, imageUrl, cost, estimatedCosts } = req.body;

  const newPlace = new Place({
    name,
    description,
    
    location: location || district, 
    category,
    
    image: image || imageUrl,
    
    cost: cost || estimatedCosts
  });

  try {
    const savedPlace = await newPlace.save();
    res.status(201).json({ message: "Destination added successfully! 🎉", data: savedPlace });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const placeId = req.params.id.trim();

    // req.body එකෙන් එන අලුත් දත්ත ටික අරගෙන database එකේ තියෙන record එක update කිරීම
    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      { $set: req.body }, // Body එකෙන් එවන ඕනෑම field එකක් dynamic ලෙස update වේ
      { new: true, runValidators: true } // true කිරීමෙන් update වූ පසු අලුත් දත්තම ආපසු ලබාදේ
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Destination not found to update" });
    }

    res.status(200).json({ message: "Destination updated successfully! 🚀", data: updatedPlace });
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
});

export default router;