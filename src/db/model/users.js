import mongoose from "mongoose";
const Schema = mongoose.Schema;

// User Collection Schema
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone_number: { type: String },
    subscribed: { type: Boolean, default: false },
    designation: { type: String },
    credits_used: { type: Number, default: 0 },
    userRole: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
