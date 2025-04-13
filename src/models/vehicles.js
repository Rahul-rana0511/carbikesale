// import { Schema, model } from "mongoose";
// const vehicleSchema = new Schema(
//   {
//     UserId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       default: null
//     },
//     vehicle_type:{
//      type: Number,
//      default: null,
//      enum:[0,1],
//      description: "0 -> Car 1 -> bike"
//     },
//     vehicle_brand:{
//         type: String,
//         default: null
//     },
//     vehicle_model: {
//       type: String,
//       default: null
//     },
//     manufacturing_year: {
//       type: String,
//       default: null
//     },
//     city: {
//         type: String,
//         default: null
//       },
//     owner: {
//       type: String,
//       default: null,
//     },
//     vehicle_used: {
//         type: String,
//         default: null,
//       },
//     vehicle_plan: {
//       type: Number,
//       default: null,
//       enum: [0,1,2,3],
//       description: "0 -> immediate, 1 -> within a month 2 -> After a month 3 -> Just checking Price"
//     },
//     vehicle_image:{
//         type: String,
//         default: null
//     },
//     vehicle_price:{
//         type: Number,
//         default: null
//     },
//     location:{
//         type:{

//         }
//     },
//     posting_date:{
//         type: Date,
//         default: null
//     },

//     role: {
//       type: Number,
//       default: 0,
//       enum: [0, 1],
//       description: "0-> Buyer 1-> Seller",
//     },
//     is_active: {
//       type: Number,
//       default: 1,
//       enum: [0, 1],
//       description: "0-> No 1-> Yes",
//     },
//     profile_image: {
//       type: String,
//       default: null
//     },
//     country_code: {
//       type: String,
//       default: null
//     },
//     phone_number: {
//       type: String,
//       default: null
//     },
//     is_profile_completed:{
//       type: Number,
//       default: 0,
//       enum: [0, 1],
//       description: "0-> No 1-> Yes",
//     },
//     device_token: {
//       type: String,
//       default: null,
//     },
//     device_type: {
//       type: Number,
//       default: 3,
//       enum: [0, 1, 2, 3],
//       description: "0:Web; 1:Android; 2:iOS; 3:default",
//     },
//     device_model: {
//       type: String, 
//       default: null, 
//     },
//     login_type: {
//       type: Number,
//       default: 0,
//       enum: [0, 1, 2],
//       description: "0: general 1: google 2: Apple",
//     }
//   },

//   { timestamps: true }
// );

// const Vehicle = model("Vehicle", vehicleSchema, "Vehicles");
// export default Vehicle;
