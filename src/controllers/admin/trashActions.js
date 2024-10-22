import Board from "../../db/model/board.js";
import Chapters from "../../db/model/chapters.js";
import Paper from "../../db/model/paper.js";
import Question from "../../db/model/questions.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";

const boardActions = async (req, res) => {
  try {
    const { type, checkedItems } = req.body;
    if (type === "restore") {
      for (const id of checkedItems) {
        await Subject.updateMany({ board: id }, { deletedAt: null });
        await Chapters.updateMany({ board: id }, { deletedAt: null });
        await Topic.updateMany({ board: id }, { deletedAt: null });
        await Paper.updateMany({ board: id }, { deletedAt: null });
        await Board.updateOne({ _id: id }, { deletedAt: null });
      }
      res.status(200).json({ message: "Boards Restored Success" });
    } else {
      for (const id of checkedItems) {
        await Subject.deleteMany({ board: id });
        await Chapters.deleteMany({ board: id });
        await Topic.deleteMany({ board: id });
        await Board.deleteOne({ _id: id });
        await Paper.deleteMany({ board: id });
      }
      res.status(200).json({ message: "Boards Deleted Success" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const subjectActions = async (req, res) => {
  try {
    const { type, checkedItems } = req.body;

    if (type === "restore") {
      for (const id of checkedItems) {
        const subjectInfo = await Subject.findOne({ _id: id }).populate(
          "board"
        );

        if (
          !subjectInfo ||
          !subjectInfo.board ||
          subjectInfo.board.deletedAt !== null
        ) {
          return res.status(409).json({
            message:
              "The board appears to be deleted. Please restore it to proceed.",
          });
        }

        // If board is valid, restore subject and related entities
        await Promise.all([
          Board.updateOne(
            { _id: subjectInfo.board._id },
            { $addToSet: { subjects: id } }
          ),
          Topic.updateMany({ subject: id }, { deletedAt: null }),
          Subject.updateOne({ _id: id }, { deletedAt: null }),
          Chapters.updateOne({ subject: id }, { deletedAt: null }),
          Paper.updateOne({ subject: id }, { deletedAt: null }),
        ]);
      }

      return res.status(200).json({ message: "Subjects Restored Success" });
    } else {
      for (const id of checkedItems) {
        const subjectInfo = await Subject.findOne({ _id: id }).populate(
          "board"
        );

        if (!subjectInfo || !subjectInfo.board) {
          continue; // Skip further actions if subject or board is not found
        }

        // Remove subject from board and delete related entities
        await Promise.all([
          Board.updateOne(
            { _id: subjectInfo.board._id },
            { $pull: { subjects: id } }
          ),
          Topic.deleteMany({ subject: id }),
          Subject.deleteOne({ _id: id }),
          Chapters.deleteOne({ subject: id }),
          Paper.deleteMany({ subject: id }),
        ]);
      }

      return res.status(200).json({ message: "Subjects Deleted Success" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};

const chapterActions = async (req, res) => {
  try {
    const { type, checkedItems } = req.body;

    if (type === "restore") {
      const restorePromises = checkedItems.map(async (id) => {
        const chaptersInfo = await Chapters.findOne({ _id: id }).populate({
          path: "subject",
          populate: {
            path: "board",
          },
        });

        if (
          !chaptersInfo ||
          !chaptersInfo.subject ||
          !chaptersInfo.subject.board ||
          chaptersInfo.subject.board.deletedAt !== null
        ) {
          res.status(500).json({
            message:
              "The board or subject appears to be deleted. Please restore them to proceed.",
          });
        }

        // If subject and board are valid, return promises for restoration
        await Promise.all([
          Subject.updateMany(
            { _id: chaptersInfo.subject._id },
            { $addToSet: { chapters: id } }
          ),
          Topic.updateMany({ chapter: id }, { deletedAt: null }),
          Chapters.updateOne({ _id: id }, { deletedAt: null }),
          Question.updateMany({ chapter: id }, { deletedAt: null }),
        ]);
      });

      await Promise.all(restorePromises);

      return res.status(200).json({ message: "Chapters Restored Success" });
    } else {
      const deletePromises = checkedItems.map(async (id) => {
        const chaptersInfo = await Chapters.findOne({ _id: id });

        if (!chaptersInfo) {
          res.status(500).json({ message: "Chapter not found." });
        }

        // Return promises for deletion
        await Promise.all([
          Subject.updateMany(
            { _id: chaptersInfo.subject },
            { $pull: { chapters: id } }
          ),
          Topic.deleteMany({ chapter: id }),
          Chapters.deleteOne({ _id: id }),
          Question.deleteMany({ chapter: id }),
        ]);
      });

      await Promise.all(deletePromises);

      return res.status(200).json({ message: "Chapters Deleted Success" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something Went Wrong" });
  }
};

const topicActions = async (req, res) => {
  try {
    const { type, checkedItems } = req.body;

    if (type === "restore") {
      const restorePromises = checkedItems.map(async (id) => {
        const topicInfo = await Topic.findOne({ _id: id }).populate({
          path: "chapter",
          populate: {
            path: "subject",
            populate: {
              path: "board",
            },
          },
        });

        if (
          !topicInfo ||
          !topicInfo.chapter ||
          !topicInfo.chapter.subject ||
          !topicInfo.chapter.subject.board ||
          topicInfo.chapter.subject.board.deletedAt !== null
        ) {
          res.status(409).json({
            message:
              "The board, subject, or chapter appears to be deleted. Please restore them to proceed.",
          });
        }

        // If board, subject, and chapter are valid, return promises for restoration
        await Promise.all([
          Chapters.updateOne(
            { _id: topicInfo.chapter._id },
            { $push: { topics: id } }
          ),
          Question.updateMany({ topic: id }, { deletedAt: null }),
          Topic.updateOne({ _id: id }, { deletedAt: null }),
        ]);
      });

      await Promise.all(restorePromises);

      return res.status(200).json({ message: "Topics Restored Success" });
    } else {
      const deletePromises = checkedItems.map(async (id) => {
        const topicInfo = await Topic.findOne({ _id: id });

        if (!topicInfo) {
          res.status(409).json({
            message: "Topic not found.",
          });
        }

        // Return promises for deletion
        await Promise.all([
          Chapters.updateOne(
            { _id: topicInfo.chapter },
            { $pull: { topics: id } }
          ),
          Question.deleteMany({ topic: id }),
          Topic.deleteOne({ _id: id }),
        ]);
      });

      await Promise.all(deletePromises);

      return res.status(200).json({ message: "Topics Deleted Success" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something Went Wrong" });
  }
};

const questionActions = async (req, res) => {
  try {
    const { type, checkedItems } = req.body;

    if (type === "restore") {
      for (const id of checkedItems) {
        const question = await Question.findOne({ _id: id })
          .populate({
            path: "topic",
            populate: {
              path: "chapter",
              populate: {
                path: "subject",
                populate: {
                  path: "board",
                },
              },
            },
          })
          .populate("paper_id");

        if (
          !question ||
          !question.paper_id ||
          !question.topic ||
          !question.topic.chapter ||
          !question.topic.chapter.subject ||
          !question.topic.chapter.subject.board
        ) {
          return res.status(409).json({
            message:
              "One of the related entities appears to be deleted. Please restore them to proceed.",
          });
        }

        // If all checks pass, restore the question
        await Question.updateOne({ _id: id }, { deletedAt: null });
        await Paper.updateOne(
          { _id: question.paper_id._id },
          { $addToSet: { questions: id } }
        );
        await Topic.updateOne(
          { _id: question.topic._id },
          { $addToSet: { questions: id } }
        );
      }

      return res
        .status(200)
        .json({ message: "Questions Restored Successfully" });
    } else {
      for (const id of checkedItems) {
        const question = await Question.findOne({ _id: id })
          .populate("paper_id")
          .populate("topic");

        if (!question) {
          return res.status(404).json({ message: "Question not found." });
        }

        // Delete the question and remove references
        await Question.deleteOne({ _id: id });
        await Paper.updateOne(
          { _id: question.paper_id._id },
          { $pull: { questions: id } }
        );
        await Topic.updateOne(
          { _id: question.topic._id },
          { $pull: { questions: id } }
        );
      }

      return res
        .status(200)
        .json({ message: "Questions Deleted Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};

const paperActions = async (req, res) => {
  try {
    const { type, checkedItems } = req.body;

    if (type === "restore") {
      const restorePromises = checkedItems.map(async (id) => {
        const paper = await Paper.findOne({ _id: id });

        if (!paper) {
          res.status(409).json({
            message: "Paper not found.",
          });
        }

        const board = await Board.findOne({
          _id: paper.board,
          deletedAt: null,
        });
        const subject = await Subject.findOne({
          _id: paper.subject,
          deletedAt: null,
        });

        if (!board) {
          res.status(409).json({
            message:
              "The board appears to be deleted. Please restore it to proceed.",
          });
        }

        if (!subject) {
          res.status(409).json({
            message:
              "The Subject appears to be deleted. Please restore it to proceed.",
          });
        }

        // If board and subject are valid, return promises for restoration
        await Promise.all([
          Paper.updateOne({ _id: id }, { deletedAt: null }),
          Question.updateMany({ paper_id: id }, { deletedAt: null }),
        ]);
      });

      await Promise.all(restorePromises);

      return res.status(200).json({ message: "Papers Restored Success" });
    } else {
      const deletePromises = checkedItems.map(async (id) => {
        // Return promises for deletion
        await Promise.all([
          Paper.deleteOne({ _id: id }),
          Question.deleteMany({ paper_id: id }),
        ]);
      });

      await Promise.all(deletePromises);

      return res.status(200).json({ message: "Papers Deleted Success" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something Went Wrong" });
  }
};

export const trashActions = {
  boards: boardActions,
  subjects: subjectActions,
  chapters: chapterActions,
  topics: topicActions,
  questions: questionActions,
  papers: paperActions,
};
