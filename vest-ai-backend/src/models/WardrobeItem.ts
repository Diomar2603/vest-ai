import mongoose, { Schema, Document } from "mongoose";

export interface IWardrobeItem extends Document {
  userId: string;
  section: string;
  src: string;
  alt: string;
  createdAt: Date;
}

const WardrobeItemSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  section: { type: Schema.Types.ObjectId, ref: 'WardrobeSection', required: true },
  src: { type: String, required: true },
  alt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IWardrobeItem>("WardrobeItem", WardrobeItemSchema, "WardrobeItem");