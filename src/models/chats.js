import { Schema, model } from "mongoose";

const ChatSchema = new Schema(
  {
    room_id: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
    },
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    //	0-> Text, 1->Image, 2-> File, 3-> video 4 -> Reply Message 5 -> Emoji
    message_type: {
      type: Number,
    },
    
    message_content: {
      type: String,
      default: null
    },
   
    deleted_by: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ]
  },
  { timestamps: true }
);

const Chat = model("Chat", ChatSchema, "chats");
export default Chat;