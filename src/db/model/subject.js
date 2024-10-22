import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Subjects Collection Schema
const subjectSchema = new Schema({
  name: { type: String, required: true },
  board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapters" }],
  deletedAt: { type: Date, default: null }
}, {
  timestamps : true
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;