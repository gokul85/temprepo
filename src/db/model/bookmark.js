import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Bookmarks Collection Schema
const bookmarksSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    questionId: { type: Schema.Types.ObjectId, ref: "Question" },
  },
  {
    timestamps: true,
  }
);

const Bookmarks = mongoose.model("Bookmarks", bookmarksSchema);

export default Bookmarks;
