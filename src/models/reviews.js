import { Schema, model } from "mongoose";
const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    review:{
        type: String,
        default: null
    },
    ratings:{
        type: Number,
        default: 0
    }
  
  },

  { timestamps: true }
);

const Review = model("Review", reviewSchema, "Reviews");
export default Review;
