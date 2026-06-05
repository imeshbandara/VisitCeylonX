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
  estimatedCosts: { type: Number },
  
  mapEmbedUrl: { type: String }
}, { timestamps: true });

// 1. FOR POST REQUESTS: Automatically sync fields before saving a new document
placeSchema.pre('save', async function() {
  if (!this.location && this.district) this.location = this.district;
  if (!this.district && this.location) this.district = this.location;
  
  if (!this.image && this.imageUrl) this.image = this.imageUrl;
  if (!this.imageUrl && this.image) this.imageUrl = this.image;
  
  if (!this.cost && this.estimatedCosts) this.cost = this.estimatedCosts;
  if (!this.estimatedCosts && this.cost) this.estimatedCosts = this.cost;
});

// 2. FOR PUT REQUESTS: Automatically sync fields when findByIdAndUpdate/findOneAndUpdate is triggered
placeSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate();
  
  
  const data = update.$set || update;

  if (data.district && !data.location) data.location = data.district;
  if (data.location && !data.district) data.district = data.location;

  if (data.imageUrl && !data.image) data.image = data.imageUrl;
  if (data.image && !data.imageUrl) data.imageUrl = data.image;

  if (data.estimatedCosts && !data.cost) data.cost = data.estimatedCosts;
  if (data.cost && !data.estimatedCosts) data.estimatedCosts = data.cost;
});

const Place = mongoose.model('Place', placeSchema);
export default Place;