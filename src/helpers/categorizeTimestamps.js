export const categorizeTimestamps = (timestamps) => {
  const currentTimestamp = new Date();
  const last24Hours = [];
  const lastWeek = [];
  const lastMonth = [];
  timestamps.forEach((timestampStr) => {
    const timestamp = new Date(timestampStr);
    const timeDifference = currentTimestamp - timestamp;
    if (timeDifference <= 24 * 60 * 60 * 1000) {
      last24Hours.push(timestampStr);
    } else if (timeDifference <= 7 * 24 * 60 * 60 * 1000) {
      lastWeek.push(timestampStr);
    } else if (timeDifference <= 30 * 24 * 60 * 60 * 1000) {
      lastMonth.push(timestampStr);
    }
  });
  return {
    last24Hours: last24Hours.length,
    lastWeek: lastWeek.length,
    lastMonth: lastMonth.length,
  };
};
