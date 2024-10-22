import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDb from "./src/db/config/dbConfig.js";
//routers
import userRoute from "./src/routes/userRoutes.js";
import adminRoute from "./src/routes/adminRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ping from "./ping.js";
// import { crypto } from "./src/helpers/hash.js";
// import { uploadTxttoaws } from "./src/libs/aws_s3.js";
// import mail from "./src/mail/index.js";
import { upload } from "./src/helpers/fileHandlers.js";
import { uploadFileToAWS, getSignedURL } from "./src/libs/aws_s3.js";
import { backupMongoDB } from "./src/controllers/backup/dbBackupController.js";
import ejs from "ejs";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*"
  })
);
// app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

//middleware to initialize user and admin route
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.get('/api/ping', ping.PingTime);
app.get('/api/ping/db', ping.PingDb);
app.get("/", (req, res) => res.send("running"))

app.post("/upload", upload.array("file"), async (req, res) => {
  let files = await uploadFileToAWS(req.files);
  console.log(files);
  res.send("done");
});

app.get("/get/:id", async (req, res) => {
  let file = req.params.id;
  let url = await getSignedURL(file);
  console.log(url);
  res.send(url);
});

const startServer = async () => {
  try {
    connectDb(process.env.MONGO_DB_URI);
    app.listen(process.env.PORT, () =>
      console.log(
        `server running in port http://localhost:${process.env.PORT}/`
      )
    );
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

startServer();
