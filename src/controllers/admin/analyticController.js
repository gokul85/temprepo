import Analytics from "../../db/model/analytics.js";
import Board from "../../db/model/board.js";
import Chapters from "../../db/model/chapters.js";
import Question from "../../db/model/questions.js";
import Subject from "../../db/model/subject.js";
import Topic from "../../db/model/topic.js";
import Paper from "../../db/model/paper.js";
import { categorizeTimestamps } from "../../helpers/categorizeTimestamps.js";

export const getAnalyticData = async (req, res) => {
  try {
    // const analyticData = await Analytics.find({});
    // const visitors = categorizeTimestamps(analyticData[0].visitedAt);
    // const signedUps = categorizeTimestamps(analyticData[0].signedUpAt);
    // const subscriptions = categorizeTimestamps(analyticData[0].subscribedAt);
    // res.status(200).json({ visitors, signedUps, subscriptions });

    const getCounts = async (Model, filter = {}) => {
      const total = await Model.countDocuments();
      const active = await Model.countDocuments({ ...filter, deletedAt: null });
      const deleted = await Model.countDocuments({
        ...filter,
        deletedAt: { $ne: null },
      });
      return { total, active, deleted };
    };

    const counts = await Promise.all([
      getCounts(Board),
      getCounts(Subject),
      getCounts(Chapters),
      getCounts(Topic),
      getCounts(Question),
      getCounts(Paper),
    ]);

    const services = [
      "Boards",
      "Subjects",
      "Chapters",
      "Topics",
      "Questions",
      "Papers",
    ];

    const result = services.map((service, index) => ({
      service,
      ...counts[index],
    }));

    res.status(200).json(result);
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
