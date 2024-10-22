import express from "express";
const router = express.Router();
import multer from "multer";
const upload = multer({ dest: "uploads/" });
//authorization imports
import { UserAccessPermission } from "../middlewares/AuthPermission.js";
import { controller } from "../controllers/client/getPapers.js";
import { Auth } from "../controllers/client/userAuth.js";
import { Questions } from "../controllers/client/questions.js";
import { BookmarkController } from "../controllers/client/bookmarkController.js";
import { UserProfileController } from "../controllers/client/accountInfoController.js";
import { UserPlanInfoController } from "../controllers/client/userPlanInfoController.js";
import { UaController } from "../controllers/client/uaController.js";
import { clientCurrencyController } from "../controllers/client/currenciesController.js";
import { PlanController } from "../controllers/client/planController.js";
import { TopicMain } from "../controllers/client/topicWise.js";
import { PaperMain } from "../controllers/client/paperWise.js";
import { Profile } from "../controllers/client/profile.js";
import { emailVerifyController } from "../controllers/client/verifyEmailController.js";
import { coupenValidationController } from "../controllers/client/coupenValidationController.js";
import { subscriptionValidityController } from "../controllers/client/checkSubscriptionController.js";

//aws image upload
// import uploadFileToAWS from "../libs/aws_s3.js";
//payment gateway
import { PaymentGateway } from "../controllers/gateway/payment.js";

router.get("/", controller.get);

// User auth Permissions
router.post("/login", Auth.login);
router.post("/conflict/logout", Auth.conflict);
router.post("/logout", Auth.logout);

// User main Page Endpoints
router.get("/main/t/intial", TopicMain.intial);
router.get("/main/t/board/:id", TopicMain.byBoard);
router.get("/main/t/subject/:id", TopicMain.bySubject);
router.get("/main/t/chapters/:id", TopicMain.byChapter);
router.get("/main/p/intial", PaperMain.intial);
router.get("/main/p/board/:id", PaperMain.byBoard);
router.get("/main/p/subject/:id", PaperMain.bySubject);
router.post("/main/p/years/:id", PaperMain.byYear);
router.get("/main/questions/t/:id", Questions.topicQuest);
router.get("/main/questions/p/:id", Questions.paperQuest);
router.get("/main/question/:id", Questions.fetch);

router.put("/account/forgot/:id", UserProfileController.forgot);

router.use("/profile", UserAccessPermission());
//user profile account controller
router.get("/profile", Profile.get);
router.get("/profile/account", UserProfileController.get);
router.put("/profile/account/:id", UserProfileController.put);
router.post("/profile/account/verify", UserProfileController.post);

//bookmarks controller
router.get("/profile/bookmark", BookmarkController.get);
router.get("/question/bookmark/:id", BookmarkController.fetch);
router.post("/profile/bookmark", BookmarkController.post);
router.delete("/profile/bookmark/:id", BookmarkController.delete);

//user profile plan controller
router.get("/profile/plan", UserPlanInfoController.get);

//user agent controller
router.get("/profile/ua", UaController.get);

//currencies controller
router.get("/currencies", clientCurrencyController.get);

//plan controller
router.get("/plan/:id", PlanController.get);

// payment gateway integration
router.post("/createOrder/:id", PaymentGateway.post.generateOrder);
router.post("/checkout/success", PaymentGateway.post.success);
router.post("/create-checkout/:id", PaymentGateway.post.generateCheckout);

//email verification user controller
router.post("/verify/email", emailVerifyController.v_email);
router.post("/verify/otp", emailVerifyController.v_otp);

//coupon validation
router.post("/validate/coupon", coupenValidationController.post);

//check the subscription validity
router.use('/check', UserAccessPermission())
router.get("/check/validity", subscriptionValidityController.get);

//aws s3
// router.post("/upload", upload.array('files'), async (req,res) => {
//     try{
//         let files = await uploadFileToAWS(req.files);
//
//         if(files.status){
//             res.status(200).send(files)
//         }else{
//             res.status(400).send("something went wrong");
//         }
//     }catch(e){
//          res.status(500).json({ message: "Something Went Wrong" });
//     }
// })
router.post("/upload", upload.array("files"), async (req, res) => {
  try {
    let files = await uploadFileToAWS(req.files);

    if (files.status) {
      res.status(200).send(files);
    } else {
      res.status(400).send("something went wrong");
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

export default router;
