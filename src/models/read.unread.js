import { Schema, model } from "mongoose";

const readUnreadSchema = new Schema(
  {
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: "User" ,
        default: null
    },
    room_id:{
        type:Schema.Types.ObjectId,
        ref:"chatRoom",
         default: null
    },
    message_id:{
        type:Schema.Types.ObjectId,
        ref:"Chat",
         default: null
    },
    // 0 -> unseen 1 -> seen
    status:{
        type: Number,
         default: null
    },
  },
  { timestamps: true }
);

const readUnread = model("readUnread", readUnreadSchema, "readUnreads");
export default readUnread;