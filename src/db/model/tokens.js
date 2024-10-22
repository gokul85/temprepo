import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tokens: { type: String },
  agents: { type: String },
  is_active: { type: Boolean, default: true },
}, {
  timestamps : true
});

const Token = mongoose.model("Token", tokenSchema);
export default Token;
