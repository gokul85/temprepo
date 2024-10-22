import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Questions Collection Schema
const questionSchema = new Schema(
  {
    paper_id: { type: Schema.Types.ObjectId, ref: "Paper", required: true },
    s_no: { type: Number },
    question_number: { type: String },
    question: { type: String, required: true },
    options: [{ type: String }],
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    // topicId : {type : Number, required : true},
    topicName: { type: String },
    // chapter : {type : Number, required : true},
    chapter: { type: Schema.ObjectId, ref: "Chapters", required: true },
    answer: { type: String },
    paper: { type: String },
    varient: { type: String },
    year: { type: Number },
    month: { type: String },
    question_images: [{ type: String }],
    answers_images: [{ type: String }],
    // options_images: [{ type: String }],
    questions_info: { type: String },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
