import Bookmarks from "../../db/model/bookmark.js";
import { JWT } from "../../auth/tokens.js";
import { getUserId } from "../../helpers/getUserId.js";

const getBookmarks = async (req, res) => {
  try {
    let token = JWT.getToken(req.headers);
    if (token) {
      let user_info = JWT.parseToken(token);
      if (user_info) {
        let info = await Bookmarks.find({ userId: user_info.userId }).populate(
          "questionId",
          "question"
        );
        if (info) {
          res.status(200).json(info);
        } else {
          res.status(409).json("Issues in these service");
        }
      } else {
        res.status(400).json({ message: "No user data found" });
      }
    } else {
      res.status(401).json({ message: "No tokens found" });
    }
  } catch (e) {
    return res.status(404).json({ message: "Please login first" });
  }
};

// const getBookmark = async (req, res) => {
//   try {
//     let info = await Bookmarks.find(req.body);
//     if (info) {
//       res.status(200).json(info);
//     } else {
//       res.status(409).json("Issues in these service");
//     }
//   } catch (e) {
//
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// const postBookmark = async (req, res) => {
//   try {
//     let info = await Bookmarks.create(req.body);
//     if (info) {
//       res.status(200).json("Added to bookmark");
//     } else {
//       res.status(409).json("Issues in these service");
//     }
//   } catch (e) {
//
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

const postBookmarks = async (req, res) => {
  try {
    const token = JWT.getToken(req.headers);
    if (!token) {
      return res.status(401).json({ message: "No tokens found" });
    }

    const user_info = JWT.parseToken(token);
    if (!user_info) {
      return res.status(400).json({ message: "No user data found" });
    }

    const info = await Bookmarks.create({
      userId: user_info.userId,
      questionId: req.body.questionId,
    });
    if (!info) {
      return res.status(409).json("Issues in these service");
    }

    return res.status(200).json("Posted successfully");
  } catch (e) {
    return res.status(404).json({ message: "Please login first" });
  }
};

// const removeBookmarks = async (req, res) => {
//   try {
//     let info = await Bookmarks.deleteOne(req.body);
//     if (info) {
//       res.status(200).json("Removed from bookmark list");
//     } else {
//       res.status(409).json("Issues in these service");
//     }
//   } catch (e) {
//
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

const removeBookmark = async (req, res) => {
  try {
    const token = JWT.getToken(req.headers);
    if (!token) {
      return res.status(401).json({ message: "No tokens found" });
    }

    const user_info = JWT.parseToken(token);
    if (!user_info) {
      return res.status(400).json({ message: "No user data found" });
    }

    // Delete user's bookmarks record
    await Bookmarks.deleteOne({
      userId: user_info.userId,
      questionId: req.params.id,
    });

    return res.status(200).json("Bookmark deleted successfully");
  } catch (e) {
    return res.status(404).json({ message: "Please login first" });
  }
};

const fetchQuestBookmarkStatus = async (req, res) => {
  try {
    const userId = getUserId(req.headers);
    if (userId) {
      const bookmark = await Bookmarks.findOne({
        $and: [{ userId: userId }, { questionId: req.params.id }],
      });
      if (bookmark) {
        return res.status(200).json(true);
      } else {
        return res.status(200).json(false);
      }
    }else{
      res.status(200).json({message : false})
    }
  } catch (error) {
    return res.status(404).json({ message: "Please login first" });
  }
};

export const BookmarkController = {
  post: postBookmarks,
  delete: removeBookmark,
  get: getBookmarks,
  fetch: fetchQuestBookmarkStatus,
};
