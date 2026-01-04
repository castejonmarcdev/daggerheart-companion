import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchIndex extends Document {
  term: string;
  displayName: string;
  type: 'class' | 'ancestry' | 'community' | 'domain' | 'weapon' | 'armor' | 'mechanic' | 'guide' | 'guide-section';
  slug: string;
  priority: number;
  preview: string;
}

const SearchIndexSchema = new Schema<ISearchIndex>({
  term: { type: String, required: true, index: true },
  displayName: { type: String, required: true },
  type: {
    type: String,
    enum: ['class', 'ancestry', 'community', 'domain', 'weapon', 'armor', 'mechanic', 'guide', 'guide-section'],
    required: true,
    index: true
  },
  slug: { type: String, required: true },
  priority: { type: Number, default: 50 },
  preview: { type: String, default: '' },
});

// Index for autocomplete - prefix matching
SearchIndexSchema.index({ term: 1 });
SearchIndexSchema.index({ type: 1, priority: -1 });

export const SearchIndex = mongoose.model<ISearchIndex>('SearchIndex', SearchIndexSchema);
