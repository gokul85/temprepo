import { JWT } from "../auth/tokens.js";
import Token from "../db/model/tokens.js";

export const AccessPermission = (permission) => {
  return (req, res, next) => {
    try {
      const token = JWT.getToken(req.headers);
      // 
      if (token) {
        const isTokenValid = JWT.validateToken(token);
        if (isTokenValid) {
          const payload = JWT.parseToken(token);
          if (permission.includes(payload.role)) {
            next();
          } else {
            res.status(401).json({
              type: "access_denied",
              message: "unauthorized",
            });
          }
        } else {
          res.status(401).json({
            type: "expired",
            message: "invalid token",
          });
        }
      } else {
        res.status(401).json({
          type: "token_not_found",
          message: "unauthorized",
        });
      }
    } catch (e) {
      
      return false;
    }
  };
};

export const UserAccessPermission = () => {
  return async (req, res, next) => {
    try {
      const token = JWT.getToken(req.headers);
      if (token) {
        const isTokenValid = JWT.validateToken(token);
        if (isTokenValid) {
          const t = await Token.findOne({tokens : token})
          if(t?.is_active){
            next();
          }else{
            res.status(409).json({
              type: "expired",
              message: "invalid token",
            });
          }
        } else {
          res.status(401).json({
            type: "expired",
            message: "invalid token",
          });
        }
      } else {
        res.status(401).json({
          type: "token_not_found",
          message: "unauthorized",
        });
      }
    } catch (e) {
      
      return false;
    }
  };
};
