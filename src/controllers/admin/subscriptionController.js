import SubscriptionPlan from "../../db/model/subscription_plan.js";

const getPlans = async (req, res) => {
  try {
    let plans = await SubscriptionPlan.find({ deletedAt: null }).sort({
      currency: 1,
    });
    res.status(200).json(plans);
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

// const getPlanId = async (req, res) => {
//   try {
//     const { Currency_id } = req.body;
//     console.log(Currency_id)
//     if (!Currency_id) {
//       return res.status(400).json({ message: "Currency_id is required in the request body" });
//     }

//     let plans = await SubscriptionPlan.find({ currency_id: Currency_id, deletedAt : null });
//     res.status(200).json(plans);
//   } catch (e) {
//     res.status(500).json({ message: "Something Went Wrong" });
//   }
// };
const getPlanId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Currency_id is required in the request body" });
    }
    let plans = await SubscriptionPlan.find({ currency_id: id, deletedAt : null });
    res.status(200).json(plans);
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const createNewPlan = async (req, res) => {
  try {
    const planStatus = await SubscriptionPlan.create(req.body);
    if (planStatus) {
      res.status(201).json("Plan created");
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findOne({
      _id: req.params.id,
      deletedAt: null,
    });
    if (!plan) {
      res.status(400).json({ message: "There is no card in such id" });
    } else {
      const planStatus = await SubscriptionPlan.updateOne(
        { _id: req.params.id },
        req.body
      );
      if (planStatus) {
        res.status(200).json("Updated successfully");
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findOne({ _id: req.params.id });
    if (!plan) {
      res.status(400).json({ message: "There is no card in such id" });
    } else {
      const planStatus = await SubscriptionPlan.deleteOne(
        { _id: req.params.id },
        req.body
      );
      if (planStatus) {
        res.status(200).json("deleted successfully");
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
const softDeletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.updateOne(
      { _id: req.params.id },
      { deletedAt: Date.now() }
    );
    if (!plan) {
      res.status(400).json({ message: "There is no card in such id" });
    } else {
      const planStatus = await SubscriptionPlan.deleteOne(
        { _id: req.params.id },
        req.body
      );
      if (planStatus) {
        res.status(200).json("deleted successfully");
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
export const PlanController = {
  post: createNewPlan,
  put: updatePlan,
  delete: { softDelete: softDeletePlan, delete: deletePlan },
  get: getPlans,
  getById: getPlanId,
};
