import express from "express";
const router = express.Router();
import { xl_upload, upload } from "../helpers/fileHandlers.js";
import { coupenController } from "../controllers/admin/couponController.js";
import { AdminControllers } from "../controllers/admin/adminController.js";
import { AccessPermission } from "../middlewares/AuthPermission.js";
import { AdminDetailscController } from "../controllers/admin/fetchAdminRole.js";
import { AuthController } from "../controllers/admin/authController.js";
import { BoardController } from "../controllers/admin/boardController.js";
import { SubjectController } from "../controllers/admin/subjectController.js";
import { PlanController } from "../controllers/admin/subscriptionController.js";
import { getTransactionDetails } from "../controllers/admin/transactionController.js";
import { TopicController } from "../controllers/admin/topicController.js";
import { PaperControllers } from "../controllers/admin/papersController.js";
import { PaperBatchControllers } from "../controllers/admin/paperBatchController.js";
import { getAnalyticData } from "../controllers/admin/analyticController.js";
import { QuestionController } from "../controllers/admin/questionController.js";
import { CurrencyController } from "../controllers/admin/currencyController.js";
import { ChaptersController } from "../controllers/admin/chapterController.js";
import { TrashController } from "../controllers/admin/trashController.js";
import { trashActions } from "../controllers/admin/trashActions.js";
import { getSignedURLController } from "../controllers/admin/getSignedUrlController.js";

//admin login
router.post("/login", AuthController.post);
router.post('/s_a/register', AuthController.postSuperAdmin);

//Board schema crud operations
router.use("/board", AccessPermission(["super_admin", "admin"]));
router.post("/board", BoardController.post);
router.get("/board", BoardController.list);
router.get("/board/:id", BoardController.get);
router.put("/board/:id", BoardController.put);
router.delete("/board/:id", BoardController.delete);
router.delete("/board/h_d/:id", BoardController.hardDel);

//Subject schema crud operations
router.use("/subject", AccessPermission(["super_admin", "admin"]));
router.post("/subject/b/:id", SubjectController.post);
router.get("/subject/b/:id", SubjectController.fetch);
router.get("/subject/:id", SubjectController.get);
router.get("/subject", SubjectController.list);
router.put("/subject/:id", SubjectController.put);
router.delete("/subject/s_d/:id", SubjectController.delete);
router.delete("/subject/h_d/:id", SubjectController.hardDel);

//Chapter schema crud operations
router.use("/chapter", AccessPermission(["super_admin", "admin"]));
router.post("/chapter/s/:id", ChaptersController.post);
router.get("/chapter/s/:id", ChaptersController.fetch);
router.get("/chapter/:id", ChaptersController.get);
router.get("/chapter", ChaptersController.list);
router.put("/chapter/:id", ChaptersController.put);
router.delete("/chapter/s_d/:id", ChaptersController.delete);
router.delete("/chapter/h_d/:id", ChaptersController.hardDel);

//Topic schema crud operations
router.use("/topic", AccessPermission(["super_admin", "admin"]));
router.post("/topic/c/:id", TopicController.post);
router.get("/topic/c/:id", TopicController.fetch);
router.get("/topic/:id", TopicController.get);
router.get("/topic", TopicController.list);
router.put("/topic/:id", TopicController.put);
router.delete("/topic/s_d/:id", TopicController.delete);
router.delete("/topic/h_d/:id", TopicController.hardDel);

//Payment details
router.get(
  "/transaction_details",
  AccessPermission(["super_admin"]),
  getTransactionDetails
);

//Analytic Data fetching
router.get(
  "/analytic_details",
  AccessPermission(["super_admin"]),
  getAnalyticData
);

//Question schema functionalities
router.use("/question", AccessPermission(["super_admin", "admin"]));
router.post(
  "/question/create/:id",
  upload.fields([{ name: "questImage" }, { name: "ansImage" }]),
  QuestionController.post
);
router.get("/question/p/:id", QuestionController.getPQ);
router.get("/question/t/:id", QuestionController.getTQ);
router.get("/question/:id", QuestionController.get);
router.put(
  "/question/:id",
  upload.fields([{ name: "questImages" }, { name: "ansImages" }]),
  QuestionController.put
);
router.delete("/question/s_d/:id", QuestionController.delete);
router.delete("/question/h_d/:id", QuestionController.hardDel);
router.get("/question/create/p/:id", QuestionController.create);
router.get("/question/create/c/:id", QuestionController.createByChapter);
router.post("/question/images", getSignedURLController.post);
router.post("/question/image/delete/:id", getSignedURLController.delImage);

//admin credentials schema functionalites
router.use("/a/", AccessPermission(["super_admin"]));
router.post("/a/create", AdminControllers.post);
router.get("/a/adminList", AdminControllers.get);
router.put("/a/update/:id", AdminControllers.put);
router.delete("/a/delete/h_d/:id", AdminControllers.delete.hardDelete);
router.delete("/a/delete/s_d/:id", AdminControllers.delete.softDelete);
router.post("/a/access/permission", AuthController.accessLayer);

//coupon schema functionalities
router.use("/coupon", AccessPermission(["super_admin"]));
router.post("/coupon/create", coupenController.post);
router.get("/coupon", coupenController.get);
router.put("/coupon/:id", coupenController.put);
router.delete("/coupon/:id", coupenController.delete);

//subscription plan schema
router.use("/plan", AccessPermission(["super_admin"]));
router.post("/plan/create", PlanController.post);
router.put("/plan/:id", PlanController.put);
router.get("/plan", PlanController.get);
router.get("/plan/:id", PlanController.getById);
router.delete("/plan/s_d/:id", PlanController.delete.softDelete);
router.delete("/plan/h_d/:id", PlanController.delete.delete);

//paper batch schema controller
router.use("/batch", AccessPermission(["super_admin", "admin"]));
router.post("/batch/create", PaperBatchControllers.post);
router.put("/batch/:id", PaperBatchControllers.put);
router.get("/batch", PaperBatchControllers.get);
router.delete("/batch/:id", PaperBatchControllers.delete);

//paper schema controller
router.use("/papers", AccessPermission(["super_admin", "admin"]));
router.post("/papers/upload", xl_upload.single("file"), PaperControllers.post);
router.get("/papers", PaperControllers.get);
router.get("/papers/bs", PaperControllers.getBS);
router.get("/papers/bs/:id", PaperControllers.getS);
router.delete("/papers/:id", PaperControllers.delete);

//get admin profile details
router.use("/info", AccessPermission(["super_admin", "admin"]));
router.get("/info", AdminDetailscController.get);

//currency schema controller
router.use("/currency", AccessPermission(["super_admin"]));
router.post("/currency/create", CurrencyController.post);
router.put("/currency/:id", CurrencyController.put);
router.get("/currency", CurrencyController.get);
router.get("/currency/:id", CurrencyController.getById);
router.delete("/currency/s_d/:id", CurrencyController.delete.softDelete);
router.delete("/currency/h_d/:id", CurrencyController.delete.hardDelete);

//trash controller
router.use("/trash", AccessPermission(["super_admin"]));
router.get("/trash/boards", TrashController.boards);
router.get("/trash/subjects", TrashController.subjects);
router.get("/trash/chapters", TrashController.chapters);
router.get("/trash/topics", TrashController.topics);
router.get("/trash/papers", TrashController.papers);
router.get("/trash/questions", TrashController.questions);

//services restore and delete endpoints
router.post("/trash/action/boards", trashActions.boards);
router.post("/trash/action/subjects", trashActions.subjects);
router.post("/trash/action/chapters", trashActions.chapters);
router.post("/trash/action/topics", trashActions.topics);
router.post("/trash/action/papers", trashActions.papers);
router.post("/trash/action/questions", trashActions.questions);

export default router;
