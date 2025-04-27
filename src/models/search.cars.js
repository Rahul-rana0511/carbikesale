import { Schema, model } from "mongoose";
const searchSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    vehicleId:{
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
        default: null
    },
    count:{
        type: Number,
        default: 0
    }
  
  },

  { timestamps: true }
);

const Search = model("Search", searchSchema, "Searches");
export default Search;
