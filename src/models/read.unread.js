import { Schema, model } from "mongoose";

const readUnreadSchema = new Schema(
  {
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: "User" 
    },
    room_id:{
        type:Schema.Types.ObjectId,
        ref:"chatRoom"
    },
    message_id:{
        type:Schema.Types.ObjectId,
        ref:"Chat"
    },
    // 0 -> unseen 1 -> seen
    status:{
        type: Number,
    },
  },
  { timestamps: true }
);

const readUnread = model("readUnread", readUnreadSchema, "readUnreads");
export default readUnread;