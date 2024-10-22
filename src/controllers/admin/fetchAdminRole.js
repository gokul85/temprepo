import adminModal from "../../db/model/admin.js";
import { JWT } from "../../auth/tokens.js";

const fetchAdminDetails = async (req, res) => {
  try {
    let token = JWT.getToken(req.headers);
    if (token) {
      let { id } = JWT.parseToken(token);
      if (id) {
        let adminInfo = await adminModal
          .findOne({ _id: id })
          .select("username email userRole");
        res.status(200).json(adminInfo);
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const AdminDetailscController = {
  get: fetchAdminDetails,
};
