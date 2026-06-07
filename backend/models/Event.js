import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  month: { type: String, required: true }, // e.g., "August"
  location: { type: String, required: true }, // e.g., "Kandy"
  image: { type: String, required: true }, // Public folder path or URL
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;