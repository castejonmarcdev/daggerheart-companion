import mongoose, { Schema, Document } from 'mongoose';

export interface IAncestryFeature {
  name: string;
  description: string;
}

export interface IAncestry extends Document {
  slug: string;
  name: string;
  description: string;
  features: IAncestryFeature[];
  searchText: string;
}

const AncestryFeatureSchema = new Schema<IAncestryFeature>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const AncestrySchema = new Schema<IAncestry>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  features: [AncestryFeatureSchema],
  searchText: { type: String },
});

AncestrySchema.index({ searchText: 'text', name: 'text' });

export const Ancestry = mongoose.model<IAncestry>('Ancestry', AncestrySchema);
