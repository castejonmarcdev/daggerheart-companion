import mongoose, { Schema, Document } from 'mongoose';

export interface IMechanic extends Document {
  slug: string;
  name: string;
  category: string;
  content: string;
  summary: string;
  searchText: string;
}

const MechanicSchema = new Schema<IMechanic>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  content: { type: String, required: true },
  summary: { type: String, default: '' },
  searchText: { type: String },
});

MechanicSchema.index({ searchText: 'text', name: 'text' });

export const Mechanic = mongoose.model<IMechanic>('Mechanic', MechanicSchema);
