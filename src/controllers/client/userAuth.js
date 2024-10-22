import { uaParser } from "../../helpers/uaParser.js";
import User from "../../db/model/users.js";
import Token from "../../db/model/tokens.js";
import { crypto } from "../../helpers/hash.js";
import { JWT } from "../../auth/tokens.js";
import mail from "../../mail/index.js";
import ejs from "ejs";
import { Templates } from "../../_template.js";

const Login = async (req, res) => {
  try {
    const ua = await uaParser(req);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const isPassMatch = await crypto.compare(
        req.body.password,
        user.password
      );
      if (!isPassMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      } else {
        const existingToken = await Token.findOne({
          $and: [{ user_id: user._id }, { is_active: true }],
        });
        if (existingToken) {
          const html = {
            title: Templates.ConflictLogin.title,
            content: ejs.render(Templates.ConflictLogin.content, { userName: user.username, accountActivityLink: 'https://your-account-activity-link.com', ua : ua })  // Replace with actual values
          };
          // console.log(html);
          mail(user.email, Templates.ConflictLogin.title, html).then(() => console.log('Email sent successfully')).catch(err => console.error('Error sending email:', err));
          return res.status(409).json({
            message: "User Already Logged in",
            userId: user._id,
            ua: existingToken.agents,
          });
        } else {
          const accessToken = JWT.generateToken({ userId: user._id, ua });
          await Token.create({
            user_id: user._id,
            tokens: accessToken,
            agents: ua,
          });
          // res.cookie('accessToken', accessToken, {httpOnly : true,secure : true})
          res.status(201).json({
            message: "Logged in Success",
            accessToken,
            username: user.username,
            email: user.email,
            role: user.userRole,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const conflictLogout = async (req, res) => {
  try {
    const ua = await uaParser(req);
    if (req.body.userId) {
      const uinfo = await Token.updateOne(
        { user_id: req.body.userId, is_active: true },
        { $set: { is_active: false } }
      );
      const accessToken = JWT.generateToken({ userId: req.body.userId, ua });
      await Token.create({
        user_id: req.body.userId,
        tokens: accessToken,
        agents: ua,
      });
      const user = await User.findById(req.body.userId);
      res.status(201).json({
        message: "Logged in Success",
        accessToken,
        username: user.username,
        email: user.email,
        role: user.userRole,
      });
    } else {
      res.status(400).json({ message: "Cannot perform this service" });
    }
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const Logout = async (req, res) => {
  try {
    const token = await JWT.getToken(req.headers);
    const findActiveToken = await Token.findOne({
      $and: [{ tokens: token }, { is_active: true }],
    });
    findActiveToken.is_active = false;
    findActiveToken.save();
    res.status(200).json({ message: "Logout Success" });
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const Auth = {
  login: Login,
  conflict: conflictLogout,
  logout: Logout,
};
