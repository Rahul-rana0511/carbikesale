import { Schema, model } from "mongoose";
const vehicleSchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    vehicle_type:{
     type: Number,
     default: null,
     enum:[0,1],
     description: "0 -> Car 1 -> bike"
    },
    vehicle_brand:{
        type: String,
        default: null
    },
    vehicle_model: {
      type: String,
      default: null
    },
    manufacturing_year: {
      type: String,
      default: null
    },
    city: {
        type: String,
        default: null
      },
    owner: {
      type: String,
      default: null,
    },
    is_payment_done:{
        type: Number,
        default: 0,
        enum: [0,1],
        description: "0 -> No 1 -> yes"
    },
    vehicle_used: {
        type: String,
        default: null,
      },
    vehicle_plan: {
      type: Number,
      default: null,
      enum: [0,1,2,3],
      description: "0 -> immediate, 1 -> within a month 2 -> After a month 3 -> Just checking Price"
    },
    vehicle_images:{
        type: [String],
        default: null
    },
    vehicle_price:{
        type: Number,
        default: null
    },
     location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        //[long, lat]
        default: [0, 0],
      },
    },
    posting_date:{
        type: Date,
        default: null
    },
  },

  { timestamps: true }
);

const Vehicle = model("Vehicle", vehicleSchema, "Vehicles");
export default Vehicle;
