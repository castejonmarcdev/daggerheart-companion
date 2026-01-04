import mongoose, { Schema, Document } from 'mongoose';

export interface IDomain extends Document {
  slug: string;
  name: string;
  description: string;
  classes: string[];
  searchText: string;
}

const DomainSchema = new Schema<IDomain>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  classes: [{ type: String }],
  searchText: { type: String },
});

DomainSchema.index({ searchText: 'text', name: 'text' });

export const Domain = mongoose.model<IDomain>('Domain', DomainSchema);
