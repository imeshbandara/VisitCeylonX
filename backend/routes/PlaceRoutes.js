import express from 'express';
import Place from '../models/Place.js'; // Import the model we created earlier

const router = express.Router();

/* me kotasin kranne database eke siyaluma sthana pilibada 
thorathuru labagena frontend ekata ewimata ready kirima */
router.get('/',async(req,res)=>
{
    try{
        const places = await Place.find();
        res.status(200).json(places);
    } catch(error){
        res.status(500).json({ message : error.message});
    }
});

/* user kenek aluth place ekaka wisthara athulath 
karama eka database eke thanpath krnne meken*/

router.post('/',async (req,res)=>
{
    const{ name,description, district, category, imageUrl, estimatedCosts} = req.body;

    const newPlace = new Place({
        name,
        description,
        district,
        category,
        imageUrl,
        estimatedCosts
    });

    try{
        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (error) {
        res.status(400).json({message : error.message});
    }
});

export default router;