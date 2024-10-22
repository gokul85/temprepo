import Question from "../../db/model/questions.js";
import { deleteAWSFile, getSignedURL } from "../../libs/aws_s3.js";

const generateAwsSignedUrl = async (req, res) => {
  try {
    const { question_images, answers_images } = req.body;
    const questImage = [];
    const ansImage = [];
    if (question_images !== undefined) {
      for (const file of question_images) {
        let url = await getSignedURL(file);
        questImage.push({
          image: url,
          fileName: file,
        });
      }
    }
    if (answers_images !== undefined) {
      for (const file of answers_images) {
        let url = await getSignedURL(file);
        ansImage.push({
          image: url,
          fileName: file,
        });
      }
    }

    const url = {
      questImage,
      ansImage,
    };

    res.status(200).json(url);
  } catch (e) {
    
    res.status(500).json({ message: "something went wrong" });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { fileName, key } = req.body;
    await deleteAWSFile(fileName);
    if (key === "questImages") {
      await Question.updateOne(
        { _id: req.params.id },
        { $pull: { question_images: fileName } }
      );
      let question = await Question.findOne({ _id: req.params.id });
      res.status(200).json(question.question_images);
    } else {
      await Question.updateOne(
        { _id: req.params.id },
        { $pull: { answers_images: fileName } }
      );
      let question = await Question.findOne({ _id: req.params.id });
      res.status(200).json(question.answers_images);
    }
  } catch (error) {
    
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getSignedURLController = {
  post: generateAwsSignedUrl,
  delImage: deleteImage,
};
