export const getTimeStamp = () => {
  return new Date()
    .toISOString()
    .replace(/[-:.]/g, "")
    .replace("T", "_")
    .substring(0, 15);
};
