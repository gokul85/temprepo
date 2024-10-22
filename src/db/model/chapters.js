import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Subjects Collection Schema
const chapterSchema = new Schema(
  {
    chapterId: { type: Number, required: true },
    name: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Chapters = mongoose.model("Chapters", chapterSchema);

export default Chapters;
