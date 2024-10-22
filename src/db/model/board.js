import mongoose from "mongoose";
const Schema = mongoose.Schema;
// Board Collection Schema
const boardSchema = new Schema({
  name: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  deletedAt: { type: Date, default: null }
}, {
  timestamps : true
});

const Board = mongoose.model('Board', boardSchema);

export default Board;