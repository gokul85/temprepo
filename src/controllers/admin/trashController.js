import Board from "../../db/model/board.js";
import Chapters from "../../db/model/chapters.js";
import Paper from "../../db/model/paper.js";
import Question from "../../db/model/questions.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";

const boardTrashes = async (req, res) => {
  try {
    const delBoards = await Board.find({ deletedAt: { $ne: null } });

    const boardsWithDetails = [];

    for (const board of delBoards) {
      const chapters = await Chapters.find({
        board: board._id,
      }).select("_id");
      const subjects = await Subject.find({
        board: board._id,
      }).select("_id");
      const topics = await Topic.find({
        board: board._id,
      }).select("_id");
      const papers = await Paper.find({
        board: board._id,
      }).select("_id");

      boardsWithDetails.push({
        _id: board._id,
        name: board.name,
        chapters: chapters.map((chapter) => chapter._id),
        subjects: subjects.map((subject) => subject._id),
        topics: topics.map((topic) => topic._id),
        papers: papers.map((paper) => paper._id),
      });
    }

    res.status(200).json(boardsWithDetails);
  } catch (error) {
    
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const subjectTrashes = async (req, res) => {
  try {
    const delSubjects = await Subject.find({
      deletedAt: { $ne: null },
    }).populate("board", "name");

    const subjectsWithDetails = [];

    for (const subject of delSubjects) {
      const chapters = await Chapters.find({
        subject: subject._id,
      }).select("_id");
      const topics = await Topic.find({
        subject: subject._id,
      }).select("_id");
      const papers = await Paper.find({
        subject: subject._id,
      }).select("_id");

      subjectsWithDetails.push({
        _id: subject._id,
        name: subject.name,
        board: subject.board.name,
        chapters: chapters.map((chapter) => chapter._id),
        topics: topics.map((topic) => topic._id),
        papers: papers.map((paper) => paper._id),
      });
    }

    res.status(200).json(subjectsWithDetails);
  } catch (error) {
    
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const chapterTrashes = async (req, res) => {
  try {
    const delChapters = await Chapters.find({
      deletedAt: { $ne: null },
    })
      .populate("board", "name")
      .populate("subject", "name");

    const chaptersWithDetails = [];

    for (const chapter of delChapters) {
      const questions = await Question.find({ chapter: chapter._id }).select(
        "_id"
      );
      chaptersWithDetails.push({
        _id: chapter._id,
        name: chapter.name,
        board: chapter.board.name,
        subject: chapter.subject.name,
        topics: chapter.topics,
        questions: questions.map((question) => question._id),
      });
    }

    res.status(200).json(chaptersWithDetails);
  } catch (error) {
    
    res.status(500).json({ message: "Something went Wrong" });
  }
};
const topicTrashes = async (req, res) => {
  try {
    const delTopics = await Topic.find({
      deletedAt: { $ne: null },
    })
      .populate("board", "name")
      .populate("subject", "name")
      .populate("chapter", "name");

    const topicsWithDetails = [];

    for (const topic of delTopics) {
      topicsWithDetails.push({
        _id: topic._id,
        name: topic.name,
        board: topic.board.name,
        subject: topic.subject.name,
        chapter: topic.chapter.name,
        questions: topic.questions,
      });
    }

    res.status(200).json(topicsWithDetails);
  } catch (error) {
    
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const paperTrashes = async (req, res) => {
  try {
    const delPapers = await Paper.find({
      deletedAt: { $ne: null },
    })
      .populate("board", "name")
      .populate("subject", "name");

    const papersWithDetails = [];

    for (const paper of delPapers) {
      papersWithDetails.push({
        _id: paper._id,
        variant: paper.variant,
        board: paper.board.name,
        subject: paper.subject.name,
        questions: paper.questions,
      });
    }

    res.status(200).json(papersWithDetails);
  } catch (error) {
    
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const questionTrashes = async (req, res) => {
  try {
    const delQuestions = await Question.find({
      deletedAt: { $ne: null },
    })
      .populate("topic", "name")
      .populate("chapter", "name")
      .populate("paper_id", "variant");

    const questionWithDetails = [];

    for (const question of delQuestions) {
      questionWithDetails.push({
        _id: question._id,
        question: question.question,
        topic: question.topic.name,
        chapter: question.chapter.name,
        paper: question.paper_id.variant,
      });
    }

    res.status(200).json(questionWithDetails);
  } catch (error) {
    
    res.status(500).json({ message: "Something went Wrong" });
  }
};

export const TrashController = {
  boards: boardTrashes,
  subjects: subjectTrashes,
  chapters: chapterTrashes,
  topics: topicTrashes,
  papers: paperTrashes,
  questions: questionTrashes,
};
