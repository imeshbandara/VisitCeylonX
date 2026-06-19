import express from 'express';
import Tourist from '../models/Tourist.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Password encryption සඳහා

const router = express.Router();

// 🔐 1. REGISTER A NEW TOURIST (With Password Hashing)
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // ඊමේල් එක දැනටමත් පාවිච්චි කරලාදැයි බැලීම
        const existingTourist = await Tourist.findOne({ email });
        if (existingTourist) {
            return res.status(400).json({ message: "Email is already registered in our hub." });
        }

        // පාස්වර්ඩ් එක ආරක්ෂිතව Encrypt (Hash) කිරීම
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newTourist = new Tourist({
            fullName,
            email,
            password: hashedPassword,
            country: req.body.country || "Sri Lanka"
        });

        const savedTourist = await newTourist.save();
        
        // ලියාපදිංචි වූ සැනින් JWT Token එකක්ද සාදා යැවීම
        const token = jwt.sign(
            { id: savedTourist._id, email: savedTourist.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ result: savedTourist, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 🔑 2. SIGN IN / LOGIN TOURIST (මෙන්න මේකයි අඩු වෙලා තිබුණේ)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // ඊමේල් එක ඩේටාබේස් එකේ තියෙනවාදැයි බැලීම
        const tourist = await Tourist.findOne({ email });
        if (!tourist) {
            return res.status(404).json({ message: "User node does not exist inside database." });
        }

        // ඇතුළත් කළ පාස්වර්ඩ් එක සහ ඩේටාබේස් එකේ තියෙන හැෂ් පාස්වර්ඩ් එක සැසඳීම
        const isPasswordCorrect = await bcrypt.compare(password, tourist.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials matrix. Check password." });
        }

        // ආරක්ෂිත JWT Token එකක් නිපදවීම
        const token = jwt.sign(
            { id: tourist._id, email: tourist.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({ 
            result: tourist, 
            token,
            message: "Welcome back to VisitCeylonX Node! 👋" 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error during native login" });
    }
});

export default router;