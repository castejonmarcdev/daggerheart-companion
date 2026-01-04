import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityFeature {
  name: string;
  description: string;
}

export interface ICommunity extends Document {
  slug: string;
  name: string;
  description: string;
  adjectives: string[];
  feature: ICommunityFeature;
  searchText: string;
}

const CommunityFeatureSchema = new Schema<ICommunityFeature>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const CommunitySchema = new Schema<ICommunity>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  adjectives: [{ type: String }],
  feature: { type: CommunityFeatureSchema, required: true },
  searchText: { type: String },
});

CommunitySchema.index({ searchText: 'text', name: 'text' });

export const Community = mongoose.model<ICommunity>('Community', CommunitySchema);
