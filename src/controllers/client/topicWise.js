import Board from "../../db/model/board.js";
import Paper from "../../db/model/paper.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";
import Chapters from "../../db/model/chapters.js";

const intialFetch = async (req, res) => {
  try {
    const boards = await Board.find({ deletedAt: null });
    if (boards.length > 0) {
      const subjects = await Subject.find({
        $and: [{ board: boards[0]._id }, { deletedAt: null }],
      });
      if (subjects.length > 0) {
        const chapters = await Chapters.find({
          $and: [{ subject: subjects[0]._id }, { deletedAt: null }],
        });
        if (chapters.length > 0) {
          const topics = await Topic.find({
            $and: [{ chapter: chapters[0]._id }, { deletedAt: null }],
          });
          res.status(200).json({ boards, subjects, chapters, topics });
        } else {
          res.status(200).json({ boards, subjects, chapters, topics: [] });
        }
      } else {
        res.status(200).json({ boards, subjects, chapters: [], topics: [] });
      }
    } else {
      res.status(200).json({ boards, subjects: [], chapters: [], topics: [] });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
const fetchByBoard = async (req, res) => {
  try {
    const subjects = await Subject.find({
      $and: [{ board: req.params.id }, { deletedAt: null }],
    });
    if (subjects.length > 0) {
      const chapters = await Chapters.find({
        $and: [{ subject: subjects[0]._id }, { deletedAt: null }],
      });
      if (chapters.length > 0) {
        const topics = await Topic.find({
          $and: [{ chapter: chapters[0]._id }, { deletedAt: null }],
        });
        res.status(200).json({ subjects, chapters, topics });
      } else {
        res.status(200).json({ subjects, chapters, topics: [] });
      }
    } else {
      res.status(200).json({ subjects, chapters: [], topics: [] });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
const fetchBySubject = async (req, res) => {
  try {
    const chapters = await Chapters.find({
      $and: [{ subject: req.params.id }, { deletedAt: null }],
    });
    if (chapters.length > 0) {
      const topics = await Topic.find({
        $and: [{ chapter: chapters[0]._id }, { deletedAt: null }],
      });
      res.status(200).json({ chapters, topics });
    } else {
      res.status(200).json({ chapters, topics: [] });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
const fetchByChapter = async (req, res) => {
  try {
    const topics = await Topic.find({
      $and: [{ chapter: req.params.id }, { deletedAt: null }],
    });
    res.status(200).json({ topics });
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const TopicMain = {
  intial: intialFetch,
  byBoard: fetchByBoard,
  bySubject: fetchBySubject,
  byChapter: fetchByChapter,
};
