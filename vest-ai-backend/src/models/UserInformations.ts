import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserInformations extends Document {
  _id: Types.ObjectId;
  UserId: Types.ObjectId;
  phoneNumber?: string;
  gender: string

  dressingStyle: string[];
  preferredColors: string[];
  clothingSize: string;
  fitPreference: string;

  age?: number;
  ethnicity?: string;
  hasObesity?: boolean;
  salaryRange?: number;
  hobbies?: string[];
}


const UserInformationsSchema: Schema = new Schema(
  {
    UserId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    phoneNumber: { type: String },
    gender: { type: String, required: true },

    dressingStyle: [{ type: String, required: true }],
    preferredColors: [{ type: String, required: true }],
    clothingSize: { type: String, required: true },
    fitPreference: { type: String, required: true },

    age: { type: Number },
    ethnicity: { type: String },
    hasObesity: { type: Boolean },
    salaryRange: { type: Number },
    hobbies: [{ type: String }],
  },
  { timestamps: true }
);


export default mongoose.model<IUserInformations>("UserInformations", UserInformationsSchema, "UserInformation");
