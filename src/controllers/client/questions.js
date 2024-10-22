import Question from "../../db/model/questions.js";
import { getSignedURL } from "../../libs/aws_s3.js";

const fetchQuestByTopic = async (req, res) => {
  try {
    const questions = await Question.find({
      topic: req.params.id,
      deletedAt: null,
    })
      .sort({ year: -1 })
      .populate({
        path: "paper_id",
        populate: {
          path: "board",
          select: "name",
        },
      });

    if (!questions || questions.length === 0) {
      // res.status(404).json({ message: "Questions Not Found under Topic" });
      res.status(200).json([]);
    } else {
      const [firstQuestion, ...restOfQuestions] = questions;
      let imageList = firstQuestion.question_images.length > 0 || firstQuestion.answers_images.length > 0;
      if (imageList) {
        let questImage = [];
        let ansImage = [];
        if (firstQuestion.question_images.length > 0) {
          for (const file of firstQuestion.question_images) {
            let url = await getSignedURL(file);
            questImage.push(url);
          }
        }
        if (firstQuestion.answers_images.length > 0) {
          for (const file of firstQuestion.answers_images) {
            let url = await getSignedURL(file);
            ansImage.push(url);
          }
        }
        firstQuestion.question_images = questImage;
        firstQuestion.answers_images = ansImage;
      }
      const simplifiedRestOfQuestions = restOfQuestions.map(({ _id }) => ({
        _id,
      }));
      const modifiedQuestions = [firstQuestion, ...simplifiedRestOfQuestions];
      res.status(200).json(modifiedQuestions);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchQuestByPaper = async (req, res) => {
  try {
    const questions = await Question.find({
      $and: [{ paper_id: req.params.id }, { deletedAt: null }],
    }).populate({
      path: "paper_id",
      populate: {
        path: "board",
        select: "name",
      },
    });
    if (!questions || questions.length === 0) {
      // res.status(404).json({ message: "Questions Not Found under Paper" });
      res.status(200).json([]);
    } else {
      const [firstQuestion, ...restOfQuestions] = questions;
      let imageList = firstQuestion.question_images.length > 0 || firstQuestion.answers_images.length > 0;
      if (imageList) {
        let questImage = [];
        let ansImage = [];
        if (firstQuestion.question_images.length > 0) {
          for (const file of firstQuestion.question_images) {
            let url = await getSignedURL(file);
            questImage.push(url);
          }
        }
        if (firstQuestion.answers_images.length > 0) {
          for (const file of firstQuestion.answers_images) {
            let url = await getSignedURL(file);
            ansImage.push(url);
          }
        }
        firstQuestion.question_images = questImage;
        firstQuestion.answers_images = ansImage;
      }
      const simplifiedRestOfQuestions = restOfQuestions.map(({ _id }) => ({
        _id,
      }));
      const modifiedQuestions = [firstQuestion, ...simplifiedRestOfQuestions];
      res.status(200).json(modifiedQuestions);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchQuestById = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      deletedAt: null,
    }).populate({
      path: "paper_id",
      populate: {
        path: "board",
        select: "name",
      },
    });
    //
    let imageList =
      question.question_images.length > 0 || question.answers_images.length > 0;
    if (imageList) {
      let questImage = [];
      let ansImage = [];
      if (question.question_images.length > 0) {
        for (const file of question.question_images) {
          let url = await getSignedURL(file);
          questImage.push(url);
        }
      }
      if (question.answers_images.length > 0) {
        for (const file of question.answers_images) {
          let url = await getSignedURL(file);
          ansImage.push(url);
        }
      }
      question.question_images = questImage;
      question.answers_images = ansImage;

      //
      //
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Questions = {
  topicQuest: fetchQuestByTopic,
  paperQuest: fetchQuestByPaper,
  fetch: fetchQuestById,
};
