import Currency from "../../db/model/currency.js";
import SubscriptionPlan from "../../db/model/subscription_plan.js";

const getCurrencyList = async (req, res) => {
  try {
    let currencies = await Currency.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    res.status(200).json(currencies);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const postCurrency = async (req, res) => {
  try {
    const currency = await Currency.find({
      $or: [
        {
          Currency: req.body.Currency,
          deletedAt: null, // Check if the field exists and is not null
        },
        {
          Currency_state: req.body.Currency_state,
          deletedAt: null, // Check if the field exists and is not null
        },
      ],
    });
    if (currency.length > 0) {
      res.status(409).json({ message: "The Currency is already exists" });
    } else {
      await Currency.create(req.body);
      res.status(201).json("Currency Created");
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteCurrency = async (req, res) => {
  try {
    let deleteStatus = await Currency.deleteOne({ _id: req.params.id });
    await SubscriptionPlan.deleteMany({ currency_id: req.params.id });
    if (deleteStatus) {
      res.status(200).json("Data deleted Successfully");
    } else {
      res
        .status(409)
        .json({ message: "The desired operation cannot be performed" });
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const softDeleteCurrency = async (req, res) => {
  try {
    let deleteStatus = await Currency.updateOne(
      { _id: req.params.id },
      { deletedAt: Date.now() }
    );
    await SubscriptionPlan.updateMany(
      { currency_id: req.params.id },
      { deletedAt: Date.now() }
    );
    if (deleteStatus) {
      res.status(200).json("Currency deleted Successfully");
    } else {
      res
        .status(409)
        .json({ message: "The desired operation cannot be performed" });
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateCurrency = async (req, res) => {
  try {
    let deleteStatus = await Currency.updateOne(
      { _id: req.params.id },
      req.body
    );
    if (deleteStatus) {
      res.status(200).json("Data updated Successfully");
    } else {
      res
        .status(409)
        .json({ message: "The desired operation cannot be performed" });
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getCurrencyById = async (req, res) => {
  try {
    let data = await Currency.findOne({ _id: req.params.id });
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Currency Does not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const CurrencyController = {
  post: postCurrency,
  get: getCurrencyList,
  put: updateCurrency,
  getById: getCurrencyById,
  delete: { softDelete: softDeleteCurrency, hardDelete: deleteCurrency },
};
