import multer from "multer";
import fs from "fs";

const xl_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const xl_upload = multer({ storage: xl_storage });

export const removeFile = (filepath) => {
  try {
    fs.unlink(filepath, (err) => {
      if (err) {
        return false;
      }
      return true;
    });
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
