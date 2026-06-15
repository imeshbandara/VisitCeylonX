import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  month: { type: String, required: true }, 
  location: { type: String, required: true }, 
  image: { type: String, required: true }, 
}, { timestamps: true });


eventSchema.pre('save', async function() {
  if (this.image && this.image.startsWith('/public')) {
    this.image = this.image.replace('/public', '');
  }
});


eventSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate();
  const data = update.$set || update;
  
  if (data.image && data.image.startsWith('/public')) {
    data.image = data.image.replace('/public', '');
  }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;