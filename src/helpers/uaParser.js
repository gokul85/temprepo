import userAgent from "useragent";

export const uaParser = async (req) => {
  try {
    const ua = userAgent.parse(req.headers["user-agent"]).os.family;
    return ua;
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
