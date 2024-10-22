import { JWT } from "../../auth/tokens.js";
import Admin from "../../db/model/admin.js";
import { crypto } from "../../helpers/hash.js";

const Login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const adminInfo = await Admin.findOne({ username: userName });
    if (!adminInfo) {
      res.status(401).json({ message: "Invalid Username" });
    } else {
      const hash = adminInfo.password;
      const passMatch = await crypto.compare(password, hash);
      if (!passMatch) {
        res.status(401).json({ message: "Invalid Password" });
      } else {
        const token = JWT.generateToken({
          id: adminInfo._id.toString(),
          role: adminInfo.userRole,
        });
        res.status(200).json({
          accessToken : token,
          username: adminInfo.username,
          email: adminInfo.email,
          role: adminInfo.userRole,
        });
      }
    }
  } catch (error) {  
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const superAdminAccessLayer = async (req,res) => {
  try {
    const { email, password } = req.body;
    const adminInfo = await Admin.findOne({ $and : [
      {email: email},
      {userRole : "super_admin"}
    ] });
    if (!adminInfo) {
      res.status(401).json({ message: "Invalid Username" });
    } else {
      const hash = adminInfo.password;
      const passMatch = await crypto.compare(password, hash);
      if (!passMatch) {
        res.status(401).json({ message: "Invalid Password" });
      } else {
        res.status(200).json({
          isverified: true,
        });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const superAdminRegistry = async (req,res) => {
  try {
    let {username, password, email} = req.body;
    let findbyName = await Admin.findOne({email : email});
    if(findbyName){
      res.status(309).json({
        message : "userEmail exists"
      });
    }else{
      const hashPassword = await crypto.generate(password);
      let createCred = await Admin.create({
        username : username,
        password : hashPassword,
        userRole : "super_admin",
        email : email
      })
      if(createCred){
        res.status(200).json({
          message : "Super_admin created successfully"
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      message : "something went wrong",
      error : e.message
    })
    return false;
  }
}
export const AuthController = {
  post: Login,
  accessLayer : superAdminAccessLayer,
  postSuperAdmin : superAdminRegistry
};
