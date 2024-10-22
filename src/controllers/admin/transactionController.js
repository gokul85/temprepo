import Transaction from "../../db/model/transactions.js";

export const getTransactionDetails = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate("userId");
    // transactions[0].userId.${user_properties}
    res
      .status(200)
      .json({ message: "Transactions Fetched success.", transactions });
  } catch (error) {
    
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
