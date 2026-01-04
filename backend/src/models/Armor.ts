import mongoose, { Schema, Document } from 'mongoose';

export interface IArmor extends Document {
  slug: string;
  name: string;
  tier: number;
  thresholds: {
    major: number;
    severe: number;
  };
  score: number;
  feature?: string;
  searchText: string;
}

const ArmorSchema = new Schema<IArmor>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  tier: { type: Number, required: true, index: true },
  thresholds: {
    major: { type: Number, required: true },
    severe: { type: Number, required: true },
  },
  score: { type: Number, required: true },
  feature: { type: String },
  searchText: { type: String },
});

ArmorSchema.index({ searchText: 'text', name: 'text' });

export const Armor = mongoose.model<IArmor>('Armor', ArmorSchema);
