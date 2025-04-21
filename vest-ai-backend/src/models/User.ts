import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id : ObjectId;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String},
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema, "User");
