import mongoose, { Schema, Document } from 'mongoose';

export interface IFeature {
  name: string;
  description: string;
  type?: 'specialization' | 'mastery';
}

export interface ISubclass {
  slug: string;
  name: string;
  spellcastTrait: string;
  features: IFeature[];
}

export interface IClass extends Document {
  slug: string;
  name: string;
  description: string;
  domains: string[];
  startingEvasion: number;
  startingHP: number;
  classItems: string;
  hopeFeature: IFeature;
  classFeatures: IFeature[];
  subclasses: ISubclass[];
  searchText: string;
}

const FeatureSchema = new Schema<IFeature>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['specialization', 'mastery'] },
});

const SubclassSchema = new Schema<ISubclass>({
  slug: { type: String, required: true },
  name: { type: String, required: true },
  spellcastTrait: { type: String, default: '' },
  features: [FeatureSchema],
});

const ClassSchema = new Schema<IClass>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  domains: [{ type: String }],
  startingEvasion: { type: Number, required: true },
  startingHP: { type: Number, required: true },
  classItems: { type: String, default: '' },
  hopeFeature: { type: FeatureSchema, required: true },
  classFeatures: [FeatureSchema],
  subclasses: [SubclassSchema],
  searchText: { type: String },
});

ClassSchema.index({ searchText: 'text', name: 'text' });

export const Class = mongoose.model<IClass>('Class', ClassSchema);
