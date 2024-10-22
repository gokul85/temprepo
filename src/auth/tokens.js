import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config()

// Secret key for signing and verifying tokens
const JWT_SECRET = process.env.JWT_SECRETE_KEY;

// Function to generate JWT tokens
const generateToken = (payload, expiresIn = "15d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Function to validate JWT tokens
const validateToken = (token) => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true; // Token is valid
  } catch (error) {
    return false; // Token is invalid
  }
};

// Function to parse data from JWT tokens
const parseToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const getToken = (headers) => {
  try {
    if (headers && headers.authorization) {
      const authHeader = headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const JWT = {
  generateToken,
  validateToken,
  parseToken,
  getToken,
};
