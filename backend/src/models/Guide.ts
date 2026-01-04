import mongoose, { Schema, Document } from 'mongoose';

export interface IGuideSection {
  title: string;
  slug: string;
  content: string;
}

export interface IGuide extends Document {
  slug: string;
  name: string;
  description: string;
  icon: string;
  sections: IGuideSection[];
  searchText: string;
}

const GuideSectionSchema = new Schema<IGuideSection>({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
});

const GuideSchema = new Schema<IGuide>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  sections: [GuideSectionSchema],
  searchText: { type: String },
});

GuideSchema.index({ searchText: 'text', name: 'text' });

export const Guide = mongoose.model<IGuide>('Guide', GuideSchema);
