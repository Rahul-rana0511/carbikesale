import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    email: {
      type: String
    },
    password: {
      type: String,
      default: null
    },
    first_name: {
      type: String,
      default: null
    },
    last_name: {
        type: String,
        default: null
      },
    email_verified: {
      type: Number,
      default: 0,
    },
    phone_verified: {
        type: Number,
        default: 0,
      },
    otp: {
      type: Number,
      default: null
    },
    role: {
      type: Number,
      default: 0,
      enum: [0, 1],
      description: "0-> User 1 -> Dealer",
    },
    is_active: {
      type: Number,
      default: 1,
      enum: [0, 1],
      description: "0-> No 1-> Yes",
    },
    profile_image: {
      type: String,
      default: null
    },
    dob:{
      type: Date,
      default: null
    },
    gender:{
      type: Number,
      default: null,
      description: "0-> Male 1-> Female",
    },
    bio:{
      type: String,
      default: null
    },
    country_code: {
      type: String,
      default: null
    },
    phone_number: {
      type: String,
      default: null
    },
    license_number:{
      type: String,
      default: null
    },
    is_profile_completed:{
      type: Number,
      default: 0,
      enum: [0, 1],
      description: "0-> No 1-> Yes",
    },
    device_token: {
      type: String,
      default: null,
    },
    device_type: {
      type: Number,
      default: 3,
      enum: [0, 1, 2, 3],
      description: "0:Web; 1:Android; 2:iOS; 3:default",
    },
    device_model: {
      type: String, 
      default: null, 
    },
    login_type: {
      type: Number,
      default: 0,
      enum: [0, 1, 2],
      description: "0: general 1: google 2: Apple",
    },
    is_enable_notification:{
      type: Number,
      default: 1,
      enum: [0,1],
       description: "0 -> No 1 -> Yes",
    },
    socketId: {
      type: String,
      default: null
    },
    is_online:{
      type: Number,
      default: 0
    }
  },

  { timestamps: true }
);

const User = model("User", userSchema, "Users");
export default User;
