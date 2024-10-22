import Currency from "../../db/model/currency.js";

const getCurrencyList = async (req, res) => {
  try {
    let currencies = await Currency.find({ deletedAt: null }).sort({createdAt : -1}).select("Currency_state Currency");
    res.status(200).json(currencies);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const clientCurrencyController = {
    get : getCurrencyList
}