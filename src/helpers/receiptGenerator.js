// Helper function to generate a receipt ID with "Iquest_receipt" as prefix, timestamp, and a random number
export const generateReceiptId = () => {
  const prefix = "Iquest_receipt";
  const timestamp = Date.now(); // Get current timestamp
  const randomSuffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0"); // Generate a random 3-digit number
  const receiptId = `${prefix}_${timestamp}_${randomSuffix}`; // Concatenate prefix, timestamp, and random suffix
  return receiptId;
};
