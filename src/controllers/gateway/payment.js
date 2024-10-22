import { RazorInstance } from "../../libs/Razorpay.js";
import { generateReceiptId } from "../../helpers/receiptGenerator.js";
import Transaction from "../../db/model/transactions.js";
import User from "../../db/model/users.js";
import { crypto } from "../../helpers/hash.js";
import SubscriptionPlan from "../../db/model/subscription_plan.js";
import UserSubscription from "../../db/model/user_subscription.js";
import Coupon from "../../db/model/coupen.js";
import { calculateDiscountedAmount } from "../../helpers/calculateDiscountAmount.js";
import mail from "../../mail/index.js";
import ejs from "ejs";
import { Templates } from "../../_template.js";
import {JWT} from "../../auth/tokens.js";
const CreateOrder = async (req, res) => {
  try {
    // console.log("req");
    const planId = req.params.id;
    // console.log(planId);
    const { email, contact, coupen } = req.body;

    let userEmailRegistry = await User.findOne({ email: email });

    if (userEmailRegistry) {
      res.status(409).json({ message: "The desired email Id already exists" });
    } else {
      let selectedPlan = await SubscriptionPlan.findOne({ _id: planId });
      let coupenValidated = coupen
        ? await Coupon.findOne({ _id: coupen })
        : false;

      if (selectedPlan) {
        const receiptId = generateReceiptId();
        //create options
        const options = {
          amount: coupenValidated
            ? calculateDiscountedAmount(
                selectedPlan.plan_price,
                coupenValidated.discount_percentage
              ) * 100
            : selectedPlan.plan_price * 100,
          currency: selectedPlan.currency,
          receipt: receiptId,
        };
        RazorInstance.orders.create(options, async (err, order) => {
          if (err) {
            res.status(500).json({ message: "Something went wrong" });
          } else {
            let data = {
              receiptId: receiptId,
              razorpay_orderId: order.id,
              amount: selectedPlan.plan_price,
              Currency: selectedPlan.currency,
              email: email,
              contact: contact,
              plan: selectedPlan._id,
            };
            let info = await Transaction.create(data);
            if (info) {
              res.status(200).json(order);
            } else {
              res.status(500).json({ message: "Something went wrong" });
            }
          }
        });
      } else {
        res.status(400).json({ message: "cannot proccess this request" });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Payment gateway down" });
  }
};

const onSuccessPayment = async (req, res) => {
  try {
    // const { username, email, contact, password, designation, receiptId } =
    //   req.body;
    const encodedPayloadData = req.query.d;
    const decodedPayloadData = JSON.parse(
      decodeURIComponent(encodedPayloadData)
    );
    const { username, email, password, number, designation, receiptId, extend, userId } =
      decodedPayloadData;

    if(!extend){
      const hashPassword = await crypto.generate(password);
    let findUser = await User.find({ email: email });
    if (findUser.length > 0) {
      res.status(400).json({ message: "user Email already exists" });
    } else {
      let info = await User.create({
        username: username,
        email: email,
        phone_number: number,
        password: hashPassword,
        designation: designation,
        subscribed: true,
      });
      if (info) {
        let updateTransaction = await Transaction.updateOne(
          { receiptId: receiptId },
          {
            userId: info._id,
            status: true,
          }
        );
        let planObj = await Transaction.findOne({
          receiptId: receiptId,
        }).select("plan");
        //
        if (planObj) {
          let planInfo = await SubscriptionPlan.findOne({ _id: planObj.plan });

          let startDate = new Date();

          let endDate = new Date(
            startDate.getTime() +
              planInfo.plan_duration_number * 24 * 60 * 60 * 1000
          );

          let data = {
            userId: info._id,
            Start_date: startDate,
            end_date: endDate,
            plan_type: planInfo._id,
          };
          let userSubscription = await UserSubscription.create(data);
          if (userSubscription) {
            let html = {
              title : Templates['PaymentSuccess'].title,
              content : ejs.render(Templates['PaymentSuccess'].content, {loginLink : "https://iquest.com"})
            }
            await mail(email, Templates['PaymentSuccess'].title, html);
            res.redirect("http://dev.igcsequest.com/");
            res.status(201).json("User Created successfully");
          }
        }
      }
    }
    }else{
      let userInfo = await User.findOne({_id : userId});
      if (userId) {
        let updateTransaction = await Transaction.updateOne(
          { receiptId: receiptId },
          {
            userId: userId,
            status: true,
          }
        );
        console.log(updateTransaction);
        let planObj = await Transaction.findOne({
          receiptId: receiptId,
        }).select("plan");
        //
        if (planObj) {
          let planInfo = await SubscriptionPlan.findOne({ _id: planObj.plan });

          let prevUserSubscription = await UserSubscription.findOne({userId : userId});

          let e_date = new Date(prevUserSubscription.end_date);
          let s_date = new Date(prevUserSubscription.Start_date);
          let c_date = new Date();

          let startDate = e_date <= c_date ? s_date : c_date;

          // console.log(startDate);

          let endDate = new Date(
            e_date.getTime() +
              planInfo.plan_duration_number * 24 * 60 * 60 * 1000
          );

          let data = {
            // userId: info._id,
            Start_date: startDate,
            end_date: endDate,
            plan_type: planInfo._id,
          };
          let userSubscription = await UserSubscription.updateOne({userId : userId}, data);
          if (userSubscription) {
            let html = {
              title : Templates['PaymentSuccess'].title,
              content : ejs.render(Templates['PaymentSuccess'].content, {loginLink : "http://dev.igcsequest.com/"})
            }
            await mail(userInfo.email, Templates['PaymentSuccess'].title, html).catch(err => console.log(err));
            res.redirect("http://dev.igcsequest.com/");
            // res.status(201).json("User Created successfully");
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong " });
  }
};


//create checkout for the logged user

const CreateCheckout = async (req, res) => {
  try {
    // console.log("req");
    const planId = req.params.id;
    const token = JWT.getToken(req.headers);
    const {userId} = JWT.parseToken(token);
    const userInfo = await User.findOne({_id : userId});
    if (!userInfo) {
      res.status(409).json({ message: "user info is not found" });
    } else {
      let selectedPlan = await SubscriptionPlan.findOne({ _id: planId });
      // let coupenValidated = coupen
      //   ? await Coupon.findOne({ _id: coupen })
      //   : false;

      if (selectedPlan) {
        const receiptId = generateReceiptId();
        //create options
        const options = {
          amount: 
          // coupenValidated
          //   ? calculateDiscountedAmount(
          //       selectedPlan.plan_price,
          //       coupenValidated.discount_percentage
          //     ) * 100
          //   : 
            selectedPlan.plan_price * 100,
          currency: selectedPlan.currency,
          receipt: receiptId,
        };
        RazorInstance.orders.create(options, async (err, order) => {
          if (err) {
            res.status(500).json({ message: "Something went wrong" });
          } else {
            let data = {
              receiptId: receiptId,
              razorpay_orderId: order.id,
              amount: selectedPlan.plan_price,
              Currency: selectedPlan.currency,
              email: userInfo.email,
              contact: userInfo.phone_number,
              plan: selectedPlan._id,
            };
            let info = await Transaction.create(data);
            if (info) {
              res.status(200).json(order);
            } else {
              res.status(500).json({ message: "Something went wrong" });
            }
          }
        });
      } else {
        res.status(400).json({ message: "cannot proccess this request" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Payment gateway down" });
  }
};

export const PaymentGateway = {
  post: { generateOrder: CreateOrder, success: onSuccessPayment, generateCheckout : CreateCheckout },
};
