import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  Start_date: { type: Date },
  end_date: { type: Date },
  plan_type: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan" },
}, {
  timestamps : true
});

const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);
export default UserSubscription;