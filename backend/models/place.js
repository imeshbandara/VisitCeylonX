import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  
  // Accepting both 'location' and 'district'
  location: { type: String },
  district: { type: String },
  
  // Accepting both 'image' and 'imageUrl'
  image: { type: String },
  imageUrl: { type: String },
  
  // Accepting both 'cost' and 'estimatedCosts'
  cost: { type: Number },
  estimatedCosts: { type: Number }
}, { timestamps: true });

// Pre-save middleware to automatically sync missing keys before saving to Mongo
placeSchema.pre('save', async function() {
  if (!this.location && this.district) this.location = this.district;
  if (!this.district && this.location) this.district = this.location;
  
  if (!this.image && this.imageUrl) this.image = this.imageUrl;
  if (!this.imageUrl && this.image) this.imageUrl = this.image;
  
  if (!this.cost && this.estimatedCosts) this.cost = this.estimatedCosts;
  if (!this.estimatedCosts && this.cost) this.estimatedCosts = this.cost;
  
  // No next() call needed here in an async pre-save wrapper!
});

const Place = mongoose.model('Place', placeSchema);
export default Place;