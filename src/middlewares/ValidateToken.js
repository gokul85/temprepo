import { JWT } from "../auth/tokens.js";

export const ValidateToken = (req, res, next) => {
  try {
    const token = JWT.getToken(req.headers);
    if (!token) {
      res.status(401).json({
        type: "token_not_found",
        message: "unauthorized",
      });
    }
    const isTokenValid = JWT.validateToken(token);
    if (isTokenValid) {
      next();
    } else {
      res.status(401).json({
        type: "invalid token",
        message: "session expired",
      });
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
    return false;
  }
};
