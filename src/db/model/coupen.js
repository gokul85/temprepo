import mongoose from "mongoose";
const Schema = mongoose.Schema;
// Coupon Collection Schema
const couponSchema = new Schema({
  coupen_code: { type: String },
  valid_till: { type: Date },
  total_usage: { type: Number },
  total_used: { type: Number, default : 0 },
  discount_percentage: { type: Number },
  limit_exceed: { type: Boolean, default: false },
},{
  timestamps : true
});
const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;