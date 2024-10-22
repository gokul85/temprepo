import Coupon from "../../db/model/coupen.js";

const validateCoupon = async (req, res) => {
  try {
    let { coupon } = req.body;
    if (coupon) {
      let couponInfo = await Coupon.findOne({ coupen_code: coupon });
      if (couponInfo) {
        if (couponInfo.limit_exceed) {
          res.status(409).json({ message: "Limit exceed for the coupon" });
        } else {
          if (couponInfo) {
            let valid_till = couponInfo.valid_till;
            let currentDate = new Date();
            let isValid = currentDate <= valid_till;
            if (isValid) {
              const updateCoupon = await Coupon.updateOne(
                { _id: couponInfo._id },
                { total_used: couponInfo.total_used + 1 }
              );
              if (couponInfo.total_used + 1 === couponInfo.total_usage) {
                const setLimitExceed = await Coupon.updateOne(
                  { _id: couponInfo._id },
                  { limit_exceed: true }
                );
              }
              res
                .status(200)
                .json({
                  discount: couponInfo.discount_percentage,
                  _id: couponInfo._id,
                });
            } else {
              res.status(409).json({ message: "Coupon expired" });
            }
          } else {
            res.status(400).json({ message: "Invalid Coupon code" });
          }
        }
      } else {
        res.status(400).json({ message: "Invalid Coupon code" });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const coupenValidationController = {
  post: validateCoupon,
};
