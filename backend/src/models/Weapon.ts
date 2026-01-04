import mongoose, { Schema, Document } from 'mongoose';

export interface IWeapon extends Document {
  slug: string;
  name: string;
  tier: number;
  category: 'primary' | 'secondary';
  trait: string;
  range: string;
  damage: string;
  damageType: 'phy' | 'mag';
  burden: string;
  feature?: string;
  searchText: string;
}

const WeaponSchema = new Schema<IWeapon>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  tier: { type: Number, required: true, index: true },
  category: { type: String, enum: ['primary', 'secondary'], required: true, index: true },
  trait: { type: String, required: true, index: true },
  range: { type: String, required: true },
  damage: { type: String, required: true },
  damageType: { type: String, enum: ['phy', 'mag'], required: true },
  burden: { type: String, required: true },
  feature: { type: String },
  searchText: { type: String },
});

WeaponSchema.index({ tier: 1, category: 1 });
WeaponSchema.index({ searchText: 'text', name: 'text' });

export const Weapon = mongoose.model<IWeapon>('Weapon', WeaponSchema);
