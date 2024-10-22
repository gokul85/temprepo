import OTP from "../../db/model/otp.js";
import mail from "../../mail/index.js";
import moment from "moment";
import User from "../../db/model/users.js";
import { Templates } from "../../_template.js";
import ejs from "ejs";

const generateOTP = () => {
  try {
    return Math.floor(1000 + Math.random() * 9000);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const checkEmailExist = async (email) => {
  try {
    let userList = await User.find({ email: email });
    if (userList && userList.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const sendOtp = async (email, msg, res, user) => {
  let otp = generateOTP();
  let expiredAt = moment().add(5, "minutes").toISOString();
  let otpInfo = await OTP.create({
    otp_code: otp,
    email: email,
    expiredAt: expiredAt,
  });
  if (otpInfo) {
    const html = {
      title : Templates['OTP'].title,
      content : ejs.render(Templates['OTP'].content ,  {OTP : otp})
    }
    await mail(
      email,
      Templates['OTP'].title,
      html
    );
    res.status(201).json({
      message: "OTP successfully created and shared to your mail address",
      user,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    let { email, to } = req.body;
    const user = await User.findOne({ email: email }).select("_id");
    if (email) {
      if (to === "email") {
        //find one user with same email
        let emailExist = await checkEmailExist(email);
        if (emailExist) {
          res.status(409).json({ message: "User email is already exists" });
        } else {
          sendOtp(email, "to Verify Email Address", res, user);
        }
      } else {
        if (user) {
          sendOtp(email, "to Reset the Password", res, user);
        } else {
          res.status(409).json({ message: "Invalid User email" });
        }
      }
    }
  } catch (e) {
    
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    let { otp, email } = req.body;
    if (email && otp) {
      let otpInfo = await OTP.findOne({
        $and: [{ otp_code: otp }, { email: email }],
      });
      if (!otpInfo) {
        res.status(409).json({ message: "Invalid OTP code" });
      } else {
        const currentDateTime = moment();
        const expiryDateTime = moment(otpInfo.expiredAt);
        if (currentDateTime.isAfter(expiryDateTime)) {
          res.status(409).json({ message: "OTP expired" });
        } else {
          await OTP.deleteOne({
            $and: [{ otp_code: otp }, { email: email }],
          });
          res.status(200).json("OTP verified successfully");
        }
      }
    }
  } catch (e) {
    
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const emailVerifyController = {
  v_email: verifyEmail,
  v_otp: verifyOTP,
};
