import SubscriptionPlan from "../../db/model/subscription_plan.js";
const getPlanId = async (req, res) => {
  try {
    // const { Currency_id } = req.body;
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "Currency_id is required in the request body" });
    }

    let plans = await SubscriptionPlan.find({
      currency_id: req.params.id,
      deletedAt: null,
    });
    res.status(200).json(plans);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const PlanController = {
    get : getPlanId
}
