import Board from "../../db/model/board.js";
import Chapters from "../../db/model/chapters.js";
import Paper from "../../db/model/paper.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";

const createSubject = async (req, res) => {
  try {
    const boardInfo = await Board.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!boardInfo) {
      res.status(400).json({ message: "Board Doesn't Exist" });
      return; // Exit early if board doesn't exist
    }

    // Convert req.body.name to case-insensitive regex pattern
    const subjectNameRegex = new RegExp(`^${req.body.name}$`, "i");

    const subjectExists = await Subject.findOne({
      $and: [
        { board: boardInfo._id },
        { name: subjectNameRegex }, // Case-insensitive name check
        { deletedAt: null },
      ],
    });

    if (subjectExists) {
      res.status(409).json({ message: "Subject Already Exists" });
    } else {
      const newSubject = await Subject.create({
        name: req.body.name,
        board: boardInfo._id,
      });
      await Board.updateOne(
        { _id: boardInfo._id },
        { $push: { subjects: newSubject._id } }
      );
      res.status(201).json({ message: "Subject Created Successfully" });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getSubjects = async (req, res) => {
  try {
    const Subjects = await Subject.find({ deletedAt: null });
    res.status(200).json(Subjects);
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!subject) {
      res.status(400).json({ message: "Board Not Exists" });
    } else {
      res.status(200).json(subject);
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getBoardSubjects = async (req, res) => {
  try {
    const boardInfo = await Board.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!boardInfo) {
      res.status(400).json({ message: "Board Doesn't Exists" });
    } else {
      const subjects = await Subject.find({
        $and: [{ board: boardInfo._id }, { deletedAt: null }],
      });
      if (subjects.length === 0) {
        res.status(400).json({ message: "No Subjects under Board" });
      } else {
        res.status(200).json(subjects);
      }
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subjectInfo = await Subject.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!subjectInfo) {
      res.status(400).json({ message: "No Such Board Exists" });
    } else {
      await Subject.updateOne({ _id: req.params.id }, req.body);
      res.status(200).json({ message: "Board updated Successfully." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subjectInfo = await Subject.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!subjectInfo) {
      res.status(400).json({ message: "Subject Doesn't Exist" });
      return;
    }
    await Board.updateOne(
      { _id: subjectInfo.board },
      { $pull: { subjects: subjectInfo._id } }
    );
    await Topic.updateMany(
      { subject: subjectInfo._id },
      { deletedAt: new Date() }
    );
    await Subject.updateOne(
      { _id: subjectInfo._id },
      { deletedAt: new Date() }
    );
    await Chapters.updateOne(
      { subject: subjectInfo._id },
      { deletedAt: new Date() }
    );
    await Paper.updateOne(
      { subject: subjectInfo._id },
      { deletedAt: new Date() }
    );
    res.status(200).json({ message: "Subject Deleted Successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const hDeleteSubject = async (req, res) => {
  try {
    const subjectInfo = await Subject.findOne({
      _id: req.params.id,
    });
    if (!subjectInfo) {
      res.status(400).json({ message: "Subject Doesn't Exist" });
      return;
    }
    await Board.updateOne(
      { _id: subjectInfo.board },
      { $pull: { subjects: subjectInfo._id } }
    );
    await Topic.deleteMany({ subject: subjectInfo._id });
    await Subject.deleteOne({ _id: subjectInfo._id });
    await Chapters.deleteOne({ subject: subjectInfo._id });
    await Paper.deleteMany({ subject: subjectInfo._id });
    res.status(200).json({ message: "Subject Deleted Successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const SubjectController = {
  post: createSubject,
  get: getSubjectById,
  list: getSubjects,
  fetch: getBoardSubjects,
  put: updateSubject,
  delete: deleteSubject,
  hardDel: hDeleteSubject,
};
