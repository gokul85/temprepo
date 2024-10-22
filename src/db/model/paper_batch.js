import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Papers Batch Collection Schema
const papersBatchSchema = new Schema(
  {
    batch_title: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PapersBatch = mongoose.model("PapersBatch", papersBatchSchema);

export default PapersBatch;
