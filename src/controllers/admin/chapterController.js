import Chapters from "../../db/model/chapters.js";
import Question from "../../db/model/questions.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";

const createChapters = async (req, res) => {
  try {
    const subjectInfo = await Subject.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!subjectInfo) {
      res.status(409).json({ message: "Subject Not Found" });
    } else {
      // Convert req.body.name to case-insensitive regex pattern
      const chapterNameRegex = new RegExp(`^${req.body.name}$`, "i");
      const existingChapter = await Chapters.findOne({
        $and: [
          {
            $or: [
              { chapterId: req.body.chapterId },
              { name: chapterNameRegex },
            ],
          },
          { subject: req.params.id },
          { deletedAt: null },
        ],
      });
      if (existingChapter) {
        return res.status(409).json({ message: "Chapter Already Exists" });
      }
      const newChapter = await Chapters.create({
        chapterId: parseInt(req.body.chapterId),
        name: req.body.name,
        subject: req.params.id,
        board: subjectInfo.board,
      });
      await Subject.updateOne(
        { _id: req.params.id },
        { $push: { chapters: newChapter._id } }
      );
      res.status(201).json({ message: "Chapter Created Successfully" });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getChapterss = async (req, res) => {
  try {
    const Chapters = await Chapters.find({ deletedAt: null }).sort({ chapterId: 1 });
    res.status(200).json(Chapters);
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getChaptersById = async (req, res) => {
  try {
    const Chapter = await Chapters.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!Chapter) {
      res.status(400).json({ message: "Chapters Not Exists" });
    } else {
      res.status(200).json(Chapter);
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getSubjectChapters = async (req, res) => {
  try {
    const chapters = await Chapters.find({
      $and: [{ subject: req.params.id }, { deletedAt: null }],
    });
    if (chapters.length === 0) {
      res.status(400).json({ message: "No Chapters under Subject" });
    } else {
      res.status(200).json(chapters);
    }
  } catch (error) {
    
    res.state(500).json({ message: "Something Went wrong" });
  }
};

const updateChapters = async (req, res) => {
  try {
    const ChaptersInfo = await Chapters.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!ChaptersInfo) {
      res.status(400).json({ message: "No Such Chapters Exists" });
    } else {
      await Chapters.updateOne({ _id: req.params.id }, req.body);
      res.status(200).json({ message: "Chapters updated Successfully." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const deleteChapters = async (req, res) => {
  try {
    const ChaptersInfo = await Chapters.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!ChaptersInfo) {
      res.status(400).json({ message: "Chapters Doesn't Exists" });
    } else {
      await Subject.updateMany(
        { _id: ChaptersInfo.subject },
        { $pull: { chapters: ChaptersInfo._id } }
      );
      await Topic.updateMany(
        { chapter: ChaptersInfo._id },
        { deletedAt: new Date() }
      );
      await Chapters.updateOne(
        { _id: ChaptersInfo._id },
        { deletedAt: new Date() }
      );
      await Question.updateMany(
        { chapter: ChaptersInfo._id },
        { deletedAt: new Date() }
      );
      res.status(200).json({ message: "Chapters Deleted Successfully." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const hDeleteChapters = async (req, res) => {
  try {
    const ChaptersInfo = await Chapters.findOne({ _id: req.params.id });
    if (!ChaptersInfo) {
      res.status(400).json({ message: "Chapters Doesn't Exists" });
    } else {
      await Subject.updateMany(
        { _id: ChaptersInfo.subject },
        { $pull: { chapters: ChaptersInfo._id } }
      );
      await Topic.deleteMany({ chapter: ChaptersInfo._id });
      await Chapters.deleteOne({ _id: ChaptersInfo._id });
      await Question.deleteMany({ chapter: ChaptersInfo._id });
      res.status(200).json({ message: "Chapters Deleted Successfully." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const ChaptersController = {
  post: createChapters,
  list: getChapterss,
  fetch: getSubjectChapters,
  get: getChaptersById,
  put: updateChapters,
  delete: deleteChapters,
  hardDel: hDeleteChapters,
};
