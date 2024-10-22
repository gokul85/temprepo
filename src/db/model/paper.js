import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Papers Collection Schema
const paperSchema = new Schema(
  {
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    year: { type: Number, required: true },
    month: { type: String, required: true },
    batch_id: { type: Schema.Types.ObjectId, ref: "PapersBatch" },
    variant: { type: String, required: true },
    paper: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Paper = mongoose.model("Paper", paperSchema);

export default Paper;
