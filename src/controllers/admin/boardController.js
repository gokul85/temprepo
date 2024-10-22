import Board from "../../db/model/board.js";
import Chapters from "../../db/model/chapters.js";
import Paper from "../../db/model/paper.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";

const createBoard = async (req, res) => {
  try {
    // Convert req.body.name to case-insensitive regex pattern
    const boardNameRegex = new RegExp(`^${req.body.name}$`, "i");
    const boardInfo = await Board.findOne({
      $and: [{ name: boardNameRegex }, { deletedAt: null }],
    });
    if (boardInfo) {
      res.status(409).json({ message: "Board Already Exists" });
    } else {
      await Board.create(req.body);
      res.status(201).json({ message: "Board Created Successfully." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ deletedAt: null });
    res.status(200).json(boards);
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getBoardById = async (req, res) => {
  try {
    const board = await Board.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!board) {
      res.status(400).json({ message: "Board Not Exists" });
    } else {
      res.status(200).json(board);
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const updateBoard = async (req, res) => {
  try {
    const boardInfo = await Board.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!boardInfo) {
      res.status(400).json({ message: "No Such Board Exists" });
    } else {
      await Board.updateOne({ _id: req.params.id }, req.body);
      res.status(200).json({ message: "Board updated Successfully." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const boardInfo = await Board.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!boardInfo) {
      res.status(400).json({ message: "Board Doesn't Exists" });
    } else {
      await Subject.updateMany(
        { board: boardInfo._id },
        { deletedAt: new Date() }
      );
      await Chapters.updateMany(
        { board: boardInfo._id },
        { deletedAt: new Date() }
      );
      await Topic.updateMany(
        { board: boardInfo._id },
        { deletedAt: new Date() }
      );
      await Paper.updateMany(
        { board: boardInfo._id },
        { deletedAt: new Date() }
      );
      await Board.updateOne({ _id: boardInfo._id }, { deletedAt: new Date() });
      res.status(200).json({ message: "Board Deleted Successfully." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const hDeleteBoard = async (req, res) => {
  try {
    const boardInfo = await Board.findOne({ _id: req.params.id });
    if (!boardInfo) {
      res.status(400).json({ message: "Board Doesn't Exists" });
    } else {
      await Subject.deleteMany({ board: boardInfo._id });
      await Chapters.deleteMany({ board: boardInfo._id });
      await Topic.deleteMany({ board: boardInfo._id });
      await Board.deleteOne({ _id: boardInfo._id });
      await Paper.deleteMany({ board: boardInfo._id });
      res.status(200).json({ message: "Board Deleted Successfully." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const BoardController = {
  post: createBoard,
  list: getBoards,
  get: getBoardById,
  put: updateBoard,
  delete: deleteBoard,
  hardDel: hDeleteBoard,
};
