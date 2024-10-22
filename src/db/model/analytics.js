import mongoose from "mongoose";
const Schema = mongoose.Schema;
const analyticsSchema = new Schema(
  {
    visitorCount: { type: Number, default: 0 },
    visitedAt: [{ type: Date }],
    signedUpAt: [{ type: Date }],
    subscribedAt: [{ type: Date }],
  },
  {
    timestamps: true,
  }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
