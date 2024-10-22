import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Currency Collection Schema
const currencySchema = new Schema({
  Currency_state : {type : String},
  Currency: { type: String },
  // Currency_rate: { type: Number },
  deletedAt: { type: Date, default: null }
}, {
  timestamps : true
});

const Currency = mongoose.model("Currency", currencySchema);

export default Currency;