import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Transaction Collection Schema
const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  receiptId: { type: String },
  razorpay_orderId: { type: String },
  amount: { type: Number },
  Currency: { type: String },
  email: { type: String },
  contact: { type: Number },
  status: { type: Boolean, default : false },
  plan : {type : Schema.Types.ObjectId, ref : "SubscriptionPlan"}
}, {
  timestamps : true
});
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;