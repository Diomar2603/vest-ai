import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IWardrobeSection extends Document {
  _id: ObjectId;
  userId: string;
  name: string;
}

const WardrobeSectionchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
});

export default mongoose.model<IWardrobeSection>("WardrobeSection", WardrobeSectionchema, "WardrobeSection");