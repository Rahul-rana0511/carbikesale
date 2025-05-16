import { Schema, model } from "mongoose";
const likeVehicleSchema = new Schema(
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
   
  
  },

  { timestamps: true }
);

const Likevehicle = model("Likevehicle", likeVehicleSchema, "Likevehicles");
export default Likevehicle;
