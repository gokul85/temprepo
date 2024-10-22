import Board from "../../db/model/board.js";
import Paper from "../../db/model/paper.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";
import Chapters from "../../db/model/chapters.js";
import PapersBatch from "../../db/model/paper_batch.js";
import { getSortedPapers } from "../../helpers/getSortedPapers.js";

const intialFetch = async (req, res) => {
  try {
    const boards = await Board.find({ deletedAt: null });
    if (boards.length > 0) {
      const subjects = await Subject.find({
        $and: [{ board: boards[0]._id }, { deletedAt: null }],
      });
      if (subjects.length > 0) {
        const subjectPapers = await Paper.find({
          $and: [{ subject: subjects[0]._id }, { deletedAt: null }],
        });
        if (subjectPapers.length > 0) {
          const years = [
            ...new Set(subjectPapers.map((paper) => paper.year)),
          ].sort((a, b) => b - a);
          const yearPapers = await Paper.find({
            $and: [
              { subject: subjects[0]._id },
              { year: years[0] },
              { deletedAt: null },
            ],
          });
          const papersList = await getSortedPapers(yearPapers);
          res.status(200).json({ boards, subjects, years, papersList });
        } else {
          res.status(200).json({ boards, subjects, years: [], papersList: [] });
        }
      } else {
        res.status(200).json({ boards, subjects, years: [], papersList: [] });
      }
    } else {
      res.status(200).json({ boards, subjects: [], years: [], papersList: [] });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const fetchByBoard = async (req, res) => {
  try {
    const subjects = await Subject.find({
      $and: [{ board: req.params.id }, { deletedAt: null }],
    });
    if (subjects.length > 0) {
      const subjectPapers = await Paper.find({
        $and: [{ subject: subjects[0]._id }, { deletedAt: null }],
      });
      if (subjectPapers.length > 0) {
        const years = [
          ...new Set(subjectPapers.map((paper) => paper.year)),
        ].sort((a, b) => b - a);
        const yearPapers = await Paper.find({
          $and: [
            { subject: subjects[0]._id },
            { year: years[0] },
            { deletedAt: null },
          ],
        });
        const papersList = await getSortedPapers(yearPapers);
        res.status(200).json({ subjects, years, papersList });
      } else {
        res.status(200).json({ subjects, years: [], papersList: [] });
      }
    } else {
      res.status(200).json({ subjects, years: [], papersList: [] });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const fetchBySubject = async (req, res) => {
  try {
    const subjectPapers = await Paper.find({
      $and: [{ subject: req.params.id }, { deletedAt: null }],
    });
    if (subjectPapers.length > 0) {
      const years = [...new Set(subjectPapers.map((paper) => paper.year))].sort(
        (a, b) => b - a
      );
      const yearPapers = await Paper.find({
        $and: [
          { subject: req.params.id },
          { year: years[0] },
          { deletedAt: null },
        ],
      });
      const papersList = await getSortedPapers(yearPapers);
      res.status(200).json({ years, papersList });
    } else {
      res.status(200).json({ years: [], papersList: [] });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const fetchByYears = async (req, res) => {
  try {
    const yearPapers = await Paper.find({
      $and: [
        { subject: req.params.id },
        { year: req.body.year },
        { deletedAt: null },
      ],
    });
    const papersList = await getSortedPapers(yearPapers);
    res.status(200).json({ papersList });
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const PaperMain = {
  intial: intialFetch,
  byBoard: fetchByBoard,
  bySubject: fetchBySubject,
  byYear: fetchByYears,
};
