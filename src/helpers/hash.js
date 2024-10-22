import bcrypt from "bcryptjs";

const generateHashPassword = async (password) => {
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(password, salt);
      if (!hashPassword) {
        return null;
      }
      return hashPassword;
    }
    return null;
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const compareHashPassword = async (password, hashValue) => {
  try {
    if (password && hashValue) {
      let bool = await bcrypt.compare(password, hashValue);
      if (!bool) {
        return false;
      }
      return true;
    }
    return null;
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const crypto = {
  generate: generateHashPassword,
  compare: compareHashPassword,
};
