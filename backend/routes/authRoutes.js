import express from 'express';
import Tourist from '../models/Tourist.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/google-login', async (req, res) => {
    const { email, name, picture } = req.body;

    try {
        
        // 1. me email eken tourist kenek denatama innawada kiyala sewima
        let tourist = await Tourist.findOne({ email });

        
        //2. naththan aluth tourist kenek widiht db ekata save krnw
        if (!tourist) {
            tourist = new Tourist({
                name: name,
                email: email,
                country: "Unknown (Google Auth)", // පසුව වෙනස් කරගත හැක
                password: Math.random().toString(36).slice(-8), // Dummy password
            });
            await tourist.save();
        }

        
        // 3. ape system eka wenuwen arakshitha JWT token ekak hadanw
        const jwtToken = jwt.sign(
            { id: tourist._id, email: tourist.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // 7 days valid
        );

        res.status(200).json({
            jwtToken,
            user: {
                id: tourist._id,
                name: tourist.name,
                email: tourist.email,
                picture: picture
            }
        });

    } catch (error) {
        console.error("Backend Auth Error:", error);
        res.status(500).json({ message: "Internal Server Error during auth" });
    }
});

export default router;