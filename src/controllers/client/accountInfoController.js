import User from "../../db/model/users.js";
import { getUserId } from "../../helpers/getUserId.js";
import { crypto } from "../../helpers/hash.js";

const getUserInfo = async (req, res) => {
  try {
    const userId = getUserId(req.headers);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      const info = await User.findOne({ _id: userId }).select(
        "username email userRole designation"
      );
      if (!info) {
        return res.status(409).json("Issues in these service");
      }

      return res.status(200).json(info);
    }
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const userId = getUserId(req.headers);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // Check if 'password' field is present in the request body
      if (req.body.password) {
        // Hash the new password
        const hashedPassword = await crypto.generate(req.body.password);
        // Update the 'password' field in the request body with the hashed password
        req.body.password = hashedPassword;
      }

      // Perform the update operation
      const info = await User.updateOne({ _id: req.params.id }, req.body);
      if (!info) {
        return res.status(409).json("Issues in these service");
      }
      return res.status(200).json({ message: "Details updated Success" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // Hash the new password
    const hashedPassword = await crypto.generate(req.body.password);
    // Update the 'password' field in the request body with the hashed password
    req.body.password = hashedPassword;
    // Perform the update operation
    const info = await User.updateOne({ _id: req.params.id }, req.body);
    if (!info) {
      return res.status(409).json("Issues in these service");
    }
    return res.status(200).json(info);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyPassword = async (req, res) => {
  try {
    const userId = getUserId(req.headers);
    if (userId) {
      let userInfo = await User.findOne({ _id: userId });
      if (userInfo) {
        let password = userInfo.password;
        let toVerifyPassword = req.body.password;
        const isVerified = await crypto.compare(toVerifyPassword, password);

        if (isVerified) {
          res.status(200).json("Password verified successfully");
        } else {
          res.status(400).json({ message: "Old password is Invalid" });
        }
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const UserProfileController = {
  get: getUserInfo,
  put: updateUserInfo,
  post: verifyPassword,
  forgot: forgotPassword,
};
