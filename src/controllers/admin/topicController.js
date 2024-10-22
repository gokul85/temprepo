import Chapters from "../../db/model/chapters.js";
import Question from "../../db/model/questions.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";

const createTopic = async (req, res) => {
  try {
    const chapterInfo = await Chapters.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!chapterInfo) {
      return res.status(400).json({ message: "Subject Not Found" });
    }
    const topicNameRegex = new RegExp(`^${req.body.name}$`, "i");
    const existingTopic = await Topic.findOne({
      $and: [
        {
          $or: [{ topicId: req.body.topicId }, { name: topicNameRegex }],
        },
        { chapter: req.params.id },
        { deletedAt: null },
      ],
    });
    if (existingTopic) {
      return res.status(409).json({ message: "Topic Already Exists" });
    }
    const newTopic = await Topic.create({
      topicId: parseInt(req.body.topicId),
      name: req.body.name,
      chapter: req.params.id,
      board: chapterInfo.board,
      subject: chapterInfo.subject,
    });
    await Chapters.updateOne(
      { _id: req.params.id },
      { $push: { topics: newTopic._id } }
    );
    res.status(201).json({ message: "Topic Created Successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!topic) {
      res.status(400).json({ message: "Board Not Exists" });
    } else {
      res.status(200).json(topic);
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getTopics = async (req, res) => {
  try {
    const Topics = await Topic.find({ deletedAt: null }).sort({ topicId: 1 });
    res.status(200).json(Topics);
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getChapterTopics = async (req, res) => {
  try {
    const topics = await Topic.find({
      $and: [{ chapter: req.params.id }, { deletedAt: null }],
    }).sort({ topicId: 1 });
    res.status(200).json(topics);
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const updateTopic = async (req, res) => {
  try {
    const topicInfo = await Topic.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!topicInfo) {
      res.status(400).json({ message: "Topic Not Found" });
    } else {
      await Topic.updateOne({ _id: topicInfo._id }, req.body);
      res.status(200).json({ message: "Topic updated Success." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const topicInfo = await Topic.findOne({
      $and: [{ _id: req.params.id }, { deletedAt: null }],
    });
    if (!topicInfo) {
      res.status(400).json({ message: "Topic Doesn't Exists." });
    } else {
      await Chapters.updateOne(
        { _id: topicInfo.subject },
        { $pull: { topics: topicInfo._id } }
      );
      await Question.updateMany(
        { topic: topicInfo._id },
        { deletedAt: new Date() }
      );
      await Topic.updateOne({ _id: topicInfo._id }, { deletedAt: new Date() });
      res.status(200).json({ message: "Topic Deleted Success." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const hDeleteTopic = async (req, res) => {
  try {
    const topicInfo = await Topic.findOne({ _id: req.params.id });
    if (!topicInfo) {
      res.status(400).json({ message: "Topic Doesn't Exists." });
    } else {
      await Chapters.updateOne(
        { _id: topicInfo.subject },
        { $pull: { topics: topicInfo._id } }
      );
      await Question.deleteMany({ topic: topicInfo._id });
      await Topic.deleteOne({ _id: topicInfo._id });
      res.status(200).json({ message: "Topic Deleted Success." });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const TopicController = {
  post: createTopic,
  fetch: getChapterTopics,
  list: getTopics,
  get: getTopicById,
  put: updateTopic,
  delete: deleteTopic,
  hardDel: hDeleteTopic,
};
