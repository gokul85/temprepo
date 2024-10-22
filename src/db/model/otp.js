import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Currency Collection Schema
const otpSchema = new Schema({
  otp_code : {type : Number},
  email: { type: String },
  expiredAt: { type: Date, default: Date.now() }
}, {
  timestamps : true
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;