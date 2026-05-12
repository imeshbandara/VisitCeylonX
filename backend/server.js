import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import placeRoutes from './routes/placeRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import touristRoutes from './routes/touristRoutes.js';
import aiRoutes from './routes/aiRoutes.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // json daththa huwamaru krann use kranne


//mongodb connect kirima
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("VisitCeylonX Database Connected Successfully! ✅"))
.catch(err=>console.log("DB connection error :", err));

app.use('/api/places',placeRoutes);
app.use('/api/guides',guideRoutes);
app.use('/api/tourists', touristRoutes);
app.use('/api/ai', aiRoutes);

//basic route
app.get('/' , (req,res)=>{
    res.send("VisitCeyloneX Backend API is running...");
});

//port setting
const PORT = process.env.PORT || 5002;
app.listen(PORT , ()=>{
    console.log('server is running on port 5002');
});

//username = visitslone
//password = passwordekamokakda
//mongodb+srv://visitslone:passwordekamokakda@cluster0.pf9ql4o.mongodb.net/?appName=Cluster0

// api key - AIzaSyDbtDLtDwzw8lLA_4ZZk0SH05NNECxVnlU