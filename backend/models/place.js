import mongoose from 'mongoose';

const placeSchema = new mongoos.Schema({
    name: { type: String , required: true},
    description:{ type:String , required:true},
    district:{ type:String , required:true},
    category:{ type:String , required:true},
    imageUrl:{type:String},
    estimatedCosts:{
        transport:{type: Number},
        entranceFees:{type: Number},
        food:{type: Number}
    }
},{ timestamp: true});

export default mongoos.model('Place',placeshema);
