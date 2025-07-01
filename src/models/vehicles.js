import { Schema, model } from "mongoose";
const vehicleSchema = new Schema(
  {
    userId: {
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
    desc:{
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
      state: {
        type: String,
        default: null
      },
    owner: {
      type: Number,
      default: null,
      description: "0 -> 1st 1 -> 2nd 2 -> 3rd 3 -> 4th 4 -> beyond 4th 5 -> car dealer"
    },
    is_payment_done:{
        type: Number,
        default: 0,
        enum: [0,1],
        description: "0 -> No 1 -> yes"
    },
    vehicle_used: {
        type: Number,
        default: null,
        description: "0 -> 0-10k 1 -> 10k-20k 2 -> 20k-30k 3 -> 30k-40k 4 -> 40k-50k 5 -> 50k-60k 6 -> 60k-70k 7 -> 70k-80k 8 -> 80k-90k 9 -> more than 90k"
      },
    vehicle_plan: {
      type: Number,
      default: null,
      enum: [0,1,2,3],
      description: "0 -> immediate, 1 -> within a month 2 -> After a month 3 -> Just checking Price"
    },
    fuel_type: {
      type: Number,
      default: null,
      enum: [0,1,2,3],
      description: "0 -> petrol 1 -> desiel 2 -> electric 3 -> hybrid"
    },
    transmission:{
      type: Number,
      default: null,
      enum: [0,1],
      description: "0 -> manual 1 -> automatic"
    },
    variant:{
      type: String,
      default: null
    },
     mileage:{
      type: String,
      default: null
    },
     ground_clearance:{
      type: String,
      default: null
    },
     boot_space:{
      type: String,
      default: null
    },
     seating_cap:{
      type: Number,
      default: null
    },
     fuel_cap:{
      type: String,
      default: null
    },
     displacement:{
      type: String,
      default: null
    },
     keyless_start:{
      type: Number,
      default: null
    },
     cruise_control:{
      type: Number,
      default: null
    },
    sunroof:{
      type: Number,
      default: null
    },
    airbags:{
      type: Number,
      default: null
    },
    rear_camera:{
      type: Number,
      default: null
    },
    view_camera:{
      type: Number,
      default: null
    },
    vehicle_images:{
        type: [String],
        default: null
    },
    vehicle_price:{
        type: Number,
        default: null
    },
    post_paymnet:{
      type: Number,
      default: null
    },
    discount:{
      type: Number,
      default: null
    },
    total_payment:{
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
    pin:{
      type: String,
      default: null
    },
    payment_id:{
      type: String,
      default: null
    },
    vehicle_number:{
      type: String,
      default: null
    },
    block:{
      type: String,
      default: null
    },
    flat:{
      type: String,
      default: null
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
