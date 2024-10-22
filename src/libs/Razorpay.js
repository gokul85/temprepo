import Razorpay from "razorpay";

export const RazorInstance = new Razorpay({
  key_id: process.env.RAZOR_PAY_API_KEY,
  key_secret: process.env.RAZOR_PAY_API_SECRETE,
});
