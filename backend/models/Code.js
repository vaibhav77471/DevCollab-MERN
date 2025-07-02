import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  code: { type: String, required: true },
});

export default mongoose.model('Code', codeSchema);