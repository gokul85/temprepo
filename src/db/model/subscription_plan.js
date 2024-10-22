import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Subscription Plan Collection Schema
const subscriptionPlanSchema = new Schema({
  currency_id: { type: Schema.Types.ObjectId, ref: "Currency", required: true },
  currency : {type : String},
  plan_title: { type: String },
  plan_description: { type: String },
  plan_price: { type: Number },
  plan_duration_text: { type: Number },
  plan_duration_number: { type: Number },
  plan_access_features : [{type : String}],
  plan_badge: { type: Boolean, default: false },
  free_pass : { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, {
  timestamps : true
});
const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);

export default SubscriptionPlan;