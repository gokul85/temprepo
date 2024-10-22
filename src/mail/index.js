import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from "ejs";
import { Templates } from "../_template.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, '../templates/template.ejs');

// Read the template file
const template = fs.readFileSync(templatePath, 'utf-8');

// const transporter = nodemailer.createTransport({
//   host: "smtp.secureserver.net", // GoDaddy host server
//   port: 465,
//   secure: false, // Use STARTTLS, not SSL
//   auth: {
//     user: "support@igcsequest.com",
//     pass: "Adidev$666999",
//   },
//   tls: {
//     rejectUnauthorized: false, // Allow self-signed certificates
//   },
// });

const transporter = nodemailer.createTransport({    
  host: "smtpout.secureserver.net",  
  secure: true,
  secureConnection: false,
  tls: {
      ciphers:'SSLv3'
  },
  requireTLS:true,
  port: 465,
  debug: true,
  auth: {
    user: "support@igcsequest.com",
    pass: process.env.MAIL_APP_PASSWORD,
  }
});

let mail = async (to, subject, html) => {
  try {
    const dynamichtml = ejs.render(template, html);
    const mailOptions = {
      from: "Iquest Support<support@igcsequest.com>",
      to: to,
      subject: subject,
      html: dynamichtml,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log(info);
        return true;
      }
    });
  } catch (e) {
    // console.log(e.message);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

// const html = {
//   title: Templates['PaymentSuccess'].title,
//   content: ejs.render(Templates['PaymentSuccess'].content , {loginLink : 'https://iquest.com'})
// };

// const info = await mail('santhosh.m.cse.2021@snsce.ac.in', 'Regard the email testing', html);
// console.log(info)

export default mail;
