import { JWT } from "../auth/tokens.js";

export const getUserId = (headers) => {
  try {
    //get token from header
    const token = JWT.getToken(headers);
    if (!token) {
      return false;
    } else {
      const userInfo = JWT.parseToken(token);
      if (!userInfo) {
        return null;
      } else {
        return userInfo.userId;
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
    return e;
  }
};
