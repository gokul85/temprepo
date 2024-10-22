import User from "../../db/model/users.js";
import { JWT } from "../../auth/tokens.js";
// const editUsername = async (req, res) => {
//   try {
//     console.log("inside username");
//   } catch (error) {
//     console.log(error);
//   }
// };

const getUserInfo = async (req, res) => {
  try {
    let token = JWT.getToken(req.headers);
    if (token) {
      let { userId } = JWT.parseToken(token);
      let userInfo = await User.findOne({ _id: userId }).select(
        "username email phone_number"
      );
      res.status(200).json(userInfo);
    } else {
      res.status(401).json("No token found in headers");
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const Profile = {
  // editName: editUsername,
  get: getUserInfo,
};
