import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Topics Collection Schema
const topicSchema = new Schema(
  {
    name: { type: String, required: true },
    topicId : {type : Number , required : true},
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    chapter: { type: Schema.Types.ObjectId, ref: "Chapters", required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
