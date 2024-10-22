import Token from "../../db/model/tokens.js";
import { getUserId } from "../../helpers/getUserId.js";
const getUaInfo = async (req, res) => {
  try {
    let user_id = getUserId(req.headers);
    if (user_id) {
      let user_agents = await Token.find({ user_id: user_id }).select(
        "agents is_active createdAt"
      );
      res.status(200).json(user_agents);
    }
  } catch (e) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const UaController = {
  get: getUaInfo,
};
