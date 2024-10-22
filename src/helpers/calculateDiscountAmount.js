export const calculateDiscountedAmount = (price,discount) => {
    const discountedValue = price * (1 - discount / 100);
    return Math.round(discountedValue);
  };
  