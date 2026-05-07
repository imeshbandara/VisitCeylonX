import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
    fullName: {type:String, required:true},
    languages: [{ type: String }], 
    // Array of languages (e.g., ["English", "Sinhala"])
    contact: {type: Number , required : true},
    experience : {type: Number},
    profileImage :{type:String},
    isAvailable : {type:Boolean, default:true},
    rating : { type:Number , default : 0}


}, { timestamps: true });
/*{ timestamps: true }
It automatically records WHEN each record is created and last updated.*/

export default mongoose.model('Guide', guideSchema);