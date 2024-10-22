import couponModel from "../../db/model/coupen.js";

const createNewCoupon = async (req, res) => {
  try {
    // const {coupen_code,valid_till,total_usage,total_used,discount_percentage} = req.body;
    const coupon = await couponModel.findOne({
      coupen_code: req.body.coupen_code,
    });
    if (!coupon) {
      const data = await couponModel.create(req.body);
      if (data) {
        res.status(201).json("coupon created");
      } else {
        res.status(400).json({ message: "Cannot able to create a coupon" });
      }
    } else {
      res.status(409).json({ message: "Coupon code is already exists" });
    }
  } catch (e) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (e) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const couponStatus = await couponModel.updateOne(
      { _id: req.params.id },
      req.body
    );
    if (couponStatus) {
      res.status(200).json("Updated successfully");
    } else {
      res.status(409).json({ message: "cannot perform this operations" });
    }
  } catch (e) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const couponStatus = await couponModel.deleteOne({ _id: req.params.id });
    if (couponStatus) {
      res.status(200).json("Deleted successfully");
    } else {
      res.status(500).json({ message: "Cannot perform this operations" });
    }
  } catch (e) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const coupenController = {
  post: createNewCoupon,
  get: getAllCoupons,
  put: updateCoupon,
  delete: deleteCoupon,
};
