import { Schema, model } from "mongoose";

const stripeTransactionSchema = new Schema(
  { 
    transaction_id: String,
    user_id: { type: Schema.Types.ObjectId, ref: "User", default: null },
    other_user_id:{type: Schema.Types.ObjectId, ref: "User",  default: null },
    group_id:{type: Schema.Types.ObjectId, ref: "ChatRoom", default: null},
    payment_intent: String,
    refund_id: String,
    amount: Number,
    orderId: String,
    // 0 for paid by user 1 for withdraw
    transaction_type: { type: Number, default: 0 },
    pay_type: {
      type: Number,
    default: null,  
    description: "0 -> Vote, 1 -> Map, 2 -> Group 3 -> MarketPlace 4 -> Join/Leave Group"
  },
    // 0 for Not refunded 1 for refunded
    refunded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const StripeTransaction = model(
  "StripeTransaction",
  stripeTransactionSchema,
  "stripetransactions"
);

export default StripeTransaction;