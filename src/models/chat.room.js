import { Schema, model } from "mongoose";

const ChatRoomSchema = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    created_with: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deleted_by: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    last_message: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const ChatRoom = model("ChatRoom", ChatRoomSchema, "ChatRooms");
export default ChatRoom;