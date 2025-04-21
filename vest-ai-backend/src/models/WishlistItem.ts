import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistItem extends Document {
  userId: string;
  src: string;
  alt: string;
  createdAt: Date;
}

const WishlistItemSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  src: { type: String, required: true },
  alt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IWishlistItem>("WishlistItem", WishlistItemSchema, "WishlistItem");