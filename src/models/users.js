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
    full_name: {
      type: String,
      default: null
    },
    email_verified: {
      type: Number,
      default: 0,
    },
    email_otp: {
      type: Number,
      default: null
    },
    role: {
      type: Number,
      default: 0,
      enum: [0, 1, 2],
      description: "0-> Customer 1-> Barber 2 -> Shop Owner",
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
    country_code: {
      type: String,
      default: null
    },
    phone_number: {
      type: String,
      default: null
    },
    is_profile_completed:{
      type: Number,
      default: 0,
      enum: [0, 1],
      description: "0-> No 1-> Yes",
    },
    is_available:{
      type: Number,
      default: 1,
      enum: [0, 1],
      description: "0-> No 1-> Yes",
    },
    is_password_updated:{
      type: Number,
      default: null,
      enum: [0, 1],
      description: "0-> No 1-> Yes",
    },
    // available_days: {
    //   type: [Number],
    //   enum: [0, 1, 2, 3, 4, 5, 6],
    //   description:
    //     "0 -> Sun, 1 -> Mon, 2 -> Tues, 3 -> Wed, 4 -> Thu, 5 -> Fri, 6 -> Sat",
    //   default: [],
    // },

    available_days: {
      type: [
        {
          day: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5, 6, 7], // 0 -> Sun, 1 -> Mon, ..., 6 -> Sat
            required: true,
            description: "Day of the week",
          },
          opening_time: {
            type: String,
            required: true,
            description: "Opening time for the day",
          },
          closing_time: {
            type: String,
            required: true,
            description: "Closing time for the day",
          },
        },
      ],
      default: [],
      description:
        "Array of objects representing the schedule for each day of the week.",
    },    
    specialization: {
      type: [Schema.Types.ObjectId],
      ref: 'Specialization',
      default: null,
    },
    shop:{
      type: Schema.Types.ObjectId,
      ref: "Shop",
      default: null
    },
    allow_notification:{
      type: Number,
      default: 1,
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
    socketId:{
      type: String,
      default: null
    },
    login_type: {
      type: Number,
      default: 0,
      enum: [0, 1, 2],
      description: "0: general 1: google 2: Apple",
    }
  },

  { timestamps: true }
);

const User = model("User", userSchema, "Users");
export default User;
