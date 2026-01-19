import { Schema, model } from "mongoose";

const PromoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // store in uppercase for consistency
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    value: {
      type: Number,
    //   required: true,
      min: 1, // e.g. 10% or ₹50
    },
   usedBy: [
  {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
],
  },
  { timestamps: true }
);

const PromoCode = model("PromoCode", PromoCodeSchema, "PromoCodes");
export default PromoCode;

