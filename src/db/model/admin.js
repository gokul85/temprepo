import mongoose from "mongoose";
const Schema = mongoose.Schema;

// User Collection Schema
const adminSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userRole: { type: String, default: "admin" },
  deletedAt : {type : Date, default : null}
}, {
  timestamps : true
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;