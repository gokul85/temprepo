import Paper from "../../db/model/paper.js";
import Topic from "../../db/model/topic.js";
import Question from "../../db/model/questions.js";
import Chapters from "../../db/model/chapters.js";
import { uploadFileToAWS } from "../../libs/aws_s3.js";

const createQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, options, info, chapter, topic, question_number } =
      req.body;
    // const d = JSON.parse(body);

    let paperInfo = await Paper.findOne({ _id: id });
    let topicInfo = await Topic.findOne({ _id: topic });

    let questionCreateInfo = await Question.create({
      question_number: question_number,
      question: question,
      answer: answer,
      options: JSON.parse(options),
      topic: topic,
      topicName: topicInfo.name,
      year: paperInfo.year,
      chapter: chapter,
      questions_info: info,
      paper_id: id,
    });

    if (req.files) {
      //
      let id = questionCreateInfo._id;
      let questImages = req.files["questImage"] || undefined;
      //
      let ansImages = req.files["ansImage"] || undefined;
      //
      if (questImages && questImages.length > 0) {
        let questImageNames = await uploadFileToAWS(questImages);
        await Question.updateOne(
          { _id: id },
          { $push: { question_images: { $each: questImageNames } } }
        );
      }

      if (ansImages && ansImages.length > 0) {
        const ansImageNames = await uploadFileToAWS(ansImages);
        await Question.updateOne(
          { _id: id },
          { $push: { answers_images: { $each: ansImageNames } } }
        );
      }
    }
    if (questionCreateInfo) {
      let updatePaperInfo = await Paper.updateOne(
        { _id: id },
        { $push: { questions: questionCreateInfo._id } }
      );
      if (updatePaperInfo) {
        res.status(200).json("success");
      }
    } else {
      res.status(400).json({ message: "something went wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong." });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!question) {
      res.status(400).json({ message: "Question Not Found" });
    } else {
      res.status(200).json(question);
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong." });
  }
};

const getPaperQuestions = async (req, res) => {
  try {
    const paperInfo = await Paper.find({ _id: req.params.id, deletedAt: null });
    if (!paperInfo) {
      res.status(400).json({ message: "Invalid Request" });
    } else {
      const questions = await Question.find({
        $and: [{ paper_id: req.params.id }, { deletedAt: null }],
      }).populate("chapter", "name");
      res.status(200).json(questions);
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getTopicQuestions = async (req, res) => {
  try {
    const topicInfo = await Topic.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!topicInfo) {
      res.status(400).json({ message: "Invalid Request" });
    } else {
      const questions = await Question.find({
        $and: [{ topic: req.params.id }, { deletedAt: null }],
      });
      res.status(200).json(questions);
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const updateQuestion = async (req, res) => {
  try {
    // Update the question document in the database
    await Question.updateOne({ _id: req.params.id }, req.body);
    if (req.files) {
      let questImages = req.files["questImages"] || undefined;
      let ansImages = req.files["ansImages"] || undefined;
      if (questImages && questImages.length > 0) {
        let questImageNames = await uploadFileToAWS(questImages);
        await Question.updateOne(
          { _id: req.params.id },
          { $push: { question_images: { $each: questImageNames } } }
        );
      }

      if (ansImages && ansImages.length > 0) {
        const ansImageNames = await uploadFileToAWS(ansImages);
        await Question.updateOne(
          { _id: req.params.id },
          { $push: { answers_images: { $each: ansImageNames } } }
        );
      }
    }

    const question = await Question.findOne({ _id: req.params.id });
    // Send a success response
    res.status(200).json({ message: "Question Updated Successfully." });
  } catch (error) {
    console.log(error);
    // Log any errors and send an error response
    res.status(500).json({ message: "Something Went Wrong." });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!question) {
      res.status(404).json({ message: "Question Not Found" });
    } else {
      await Question.updateOne(
        { _id: req.params.id },
        { deletedAt: new Date() }
      );
      await Paper.updateOne(
        { _id: question.paper_id },
        { $pull: { questions: req.params.id } }
      );
      await Topic.updateOne(
        { _id: question.topic },
        { $pull: { questions: req.params.id } }
      );
      res.status(200).json({ message: "Question Deleted Success" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong." });
  }
};

const hDeleteQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({ _id: req.params.id });
    if (!question) {
      res.status(400).json({ message: "Question Not Found" });
    } else {
      await Question.deleteOne({ _id: req.params.id });
      await Paper.updateOne(
        { _id: question.paper_id },
        { $pull: { questions: req.params.id } }
      );
      await Topic.updateOne(
        { _id: question.topic },
        { $pull: { questions: req.params.id } }
      );
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong." });
  }
};

const createQuestDetails = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    const chapters = await Chapters.find({
      subject: paper.subject,
      deletedAt: null,
    }).select("name");
    const topics = await Topic.find({ chapter: chapters[0]._id }).select(
      "name"
    );
    res.status(200).json({ chapters, topics });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong." });
  }
};

const createQuestByChapter = async (req, res) => {
  try {
    const topics = await Topic.find({ chapter: req.params.id }).select("name");
    res.status(200).json({ topics });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const QuestionController = {
  post: createQuestion,
  getPQ: getPaperQuestions,
  getTQ: getTopicQuestions,
  get: getQuestionById,
  put: updateQuestion,
  delete: deleteQuestion,
  hardDel: hDeleteQuestion,
  create: createQuestDetails,
  createByChapter: createQuestByChapter,
};
