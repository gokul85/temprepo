import Admin from "../../db/model/admin.js";
import adminModal from "../../db/model/admin.js";
import { crypto } from "../../helpers/hash.js";

const createNewAdmin = async (req, res) => {
  try {
    const admin = await adminModal.findOne({ username: req.body.username });
    if (!admin) {
      const hashPassword = await crypto.generate(req.body.password);
      const data = await adminModal.create({
        username: req.body.username,
        password: hashPassword,
        email: req.body.email,
      });
      if (data) {
        res.status(201).json("Admin created successfully");
      }
    } else {
      res.status(409).json({
        message: "userName already exists",
      });
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const getAdmins = async (req, res) => {
  try {
    const adminList = await adminModal
      .find({ $and: [{ userRole: "admin" }, { deletedAt: null }] })
      .sort({ createdAt: -1 })
      .select("username email userRole");
    res.status(200).json(adminList);
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    if (req.body.password === "") {
      const updateStatus = await adminModal.updateOne(
        { _id: req.params.id },
        { username: req.body.username, email: req.body.email }
      );
      if (updateStatus) {
        res.status(200).json({ message: "Updated succcessfully" });
      }
    } else {
      const hashPassword = await crypto.generate(req.body.password);
      const updateStatus = await adminModal.updateOne(
        { _id: req.params.id },
        {
          username: req.body.username,
          email: req.body.email,
          password: hashPassword,
        }
      );
      if (updateStatus) {
        res.status(200).json({ message: "Updated succcessfully" });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const deleteStatus = await adminModal.deleteOne({ _id: req.params.id });
    if (deleteStatus) {
      res.status(200).json("deleted successfully");
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const sdeleteAdmin = async (req, res) => {
  try {
    const deleteStatus = await adminModal.updateOne(
      { _id: req.params.id },
      { deletedAt: Date.now() }
    );
    if (deleteStatus) {
      res.status(200).json("deleted successfully");
    }
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const AdminControllers = {
  post: createNewAdmin,
  get: getAdmins,
  put: updateAdmin,
  delete: { hardDelete: deleteAdmin, softDelete: sdeleteAdmin },
};
