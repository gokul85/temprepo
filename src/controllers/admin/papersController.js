import { ConvertSheet } from "../../helpers/convertExcelToJson.js";
import { removeFile } from "../../helpers/fileHandlers.js";
import Paper from "../../db/model/paper.js";
import Topic from "../../db/model/topic.js";
import Chapters from "../../db/model/chapters.js";
import Question from "../../db/model/questions.js";
import { CreateObject } from "../../helpers/organiseObjects.js";
import Board from "../../db/model/board.js";
import Subject from "../../db/model/subject.js";
import PapersBatch from "../../db/model/paper_batch.js";

const validateTemplate = (excelData) => {
  const requiredColumns = ["s_no", "question_number", "question", "chapter", "topic", "repetition", "option_1", "option_2", "option_3", "option_4", "answer", "paper", "varient", "month", "year"];
  
  // Check the first sheet of the Excel file
  const firstSheet = Object.values(excelData)[0];
  if (!firstSheet || firstSheet.length === 0) {
    return false;
  }

  // Check the keys of the first row
  const columnsInSheet = Object.keys(firstSheet[0]);

  // Compare columns
  const isTemplateValid = requiredColumns.every(column => columnsInSheet.includes(column));
  
  return isTemplateValid;
};

const uploadPaper = async (req, res) => {
  try {
    const { path: filePath } = req.file;
    const { subjectId, boardId, batchId } = req.body;

    const excelData = await ConvertSheet(filePath);
    if (!excelData) {
      removeFile(filePath);
      return res.status(400).json({ message: "Something went wrong" });
    }

    // Validate the template
    const isTemplateValid = validateTemplate(excelData);
    if (!isTemplateValid) {
      removeFile(filePath); // Ensure file removal on failure
      return res.status(409).json({ message: "Invalid Excel template" });
    }

    for (const paperData of Object.values(excelData)) {
      // Destructure the single quest data from Questions object
      const { year, month, varient: variant, paper } = paperData[0];
      const paperObject = {
        year,
        board: boardId,
        subject: subjectId,
        month,
        batch_id: batchId,
        paper,
        variant,
      };

      const paperInfo = await Paper.create(paperObject);
      if (!paperInfo._id) {
        removeFile(filePath);
        return res.status(409).json({ message: "Cannot create papers" });
      }

      const questionPromises = paperData.map(async (question) => {
        const chapterInfo = await Chapters.findOne({
          $and: [{ chapterId: question.chapter }, { subject: subjectId }],
        });
        if (chapterInfo) {
          const topicId = question.topic;
          const topicInfo = await Topic.findOne({
            $and: [{ topicId: topicId }, { chapter: chapterInfo._id }],
          });
          if (topicInfo) {
            // Create question object
            const questionObject = CreateObject(
              question,
              paperInfo._id,
              topicInfo._id,
              topicInfo.name,
              chapterInfo._id
            );
            const questionInfo = await Question.create(questionObject);
            if (questionInfo) {
              await Paper.updateOne(
                { _id: questionInfo.paper_id },
                { $push: { questions: questionInfo._id } }
              );
              return questionInfo;
            }
          } else {
            throw new Error("Topic Id listed in Excel sheet is not created yet");
          }
        } else {
          throw new Error("Chapter Id listed in Excel sheet is not created yet");
        }
      });

      await Promise.all(questionPromises);
    }

    removeFile(filePath); // Ensure file is removed after processing
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    removeFile(req.file?.path); // Ensure file removal on failure
    return res.status(500).json({ message: error.message || "Something went wrong" });
  }
};


// const uploadPaper = async (req, res) => {
//   try {
//     const { path: filePath } = req.file;
//     const { subjectId, boardId, batchId } = req.body;

//     const excelData = await ConvertSheet(filePath);
//     if (!excelData) {
//       removeFile(filePath); // Ensure file removal on failure
//       return res.status(400).json({ message: "Something went wrong" });
//     }

//     for (const paperData of Object.values(excelData)) {
//       // Destructure the single quest data from Questions object
//       const { year, month, varient: variant, paper } = paperData[0];
//       const paperObject = {
//         year,
//         board: boardId,
//         subject: subjectId,
//         month,
//         batch_id: batchId,
//         paper,
//         variant,
//       };

//       const paperInfo = await Paper.create(paperObject);
//       if (!paperInfo._id) {
//         removeFile(filePath);
//         return res.status(409).json({ message: "Cannot create papers" });
//       }

//       const questionPromises = paperData.map(async (question) => {
//         const chapterInfo = await Chapters.findOne({
//           $and: [{ chapterId: question.chapter }, { subject: subjectId }],
//         });
//         if (chapterInfo) {
//           const topicId = question.topic;
//           const topicInfo = await Topic.findOne({
//             $and: [{ topicId: topicId }, { chapter: chapterInfo._id }],
//           });
//           if (topicInfo) {
//             // Create question object
//             const questionObject = CreateObject(
//               question,
//               paperInfo._id,
//               topicInfo._id,
//               topicInfo.name,
//               chapterInfo._id
//             );
//             const questionInfo = await Question.create(questionObject);
//             if (questionInfo) {
//               await Paper.updateOne(
//                 { _id: questionInfo.paper_id },
//                 { $push: { questions: questionInfo._id } }
//               );
//               return questionInfo;
//             }
//           } else {
//             throw new Error("Topic Id listed in Excel sheet is not created yet");
//           }
//         } else {
//           throw new Error("Chapter Id listed in Excel sheet is not created yet");
//         }
//       });

//       await Promise.all(questionPromises);
//     }

//     removeFile(filePath); // Ensure file is removed after processing
//     return res.status(200).json({ message: "Success" });
//   } catch (error) {
//     removeFile(req.file?.path); // Ensure file removal on failure
//     return res.status(500).json({ message: error.message || "Something went wrong" });
//   }
// };


const fetchAllPapers = async (req, res) => {
  try {
    let papers = await Paper.find({ deletedAt: null })
      .sort({ year: -1, createdAt: -1 })
      .populate("board", "name")
      .populate("subject", "name");
    res.status(200).json(papers);
  } catch (e) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

const fetchBoard_Subject = async (req, res) => {
  try {
    const boards = await Board.find({ deletedAt: null });
    const batches = await PapersBatch.find();
    if (boards.length > 0) {
      const subjects = await Subject.find({
        $and: [{ board: boards[0]._id }, { deletedAt: null }],
      });
      res.status(200).json({ boards, subjects, batches });
    } else {
      res.status(200).json(boards);
    }
  } catch (e) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const fetchSubject = async (req, res) => {
  try {
    const subjects = await Subject.find({
      $and: [{ board: req.params.id }, { deletedAt: null }],
    });
    res.status(200).json({ subjects });
  } catch (e) {
    res.status(500).json({ message: "something went wrong" });
  }
};
const deletePaper = async (req, res) => {
  try {
    await Paper.updateOne({ _id: req.params.id }, { deletedAt: new Date() });
    await Question.updateMany(
      { paper_id: req.params.id },
      { deletedAt: new Date() }
    );
    res.status(200).json({ message: "Paper Deleted Successfully" });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

export const PaperControllers = {
  post: uploadPaper,
  get: fetchAllPapers,
  getBS: fetchBoard_Subject,
  getS: fetchSubject,
  delete: deletePaper,
};
