import { Schema, model } from "mongoose";
const blockSchema = new Schema(
  {
    blockBy: { type: Schema.Types.ObjectId, ref: "User" },
    blockTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Block = model("Block", blockSchema, "blocks");
export default Block;