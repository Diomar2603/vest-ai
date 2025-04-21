import mongoose, { Schema, Document } from "mongoose";

export interface IOutfit extends Document {
  userId: string;
  name: string;
  items: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  createdAt: Date;
}

const OutfitSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  items: [{
    id: Number,
    src: String,
    alt: String
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOutfit>("Outfit", OutfitSchema, "Outfit");