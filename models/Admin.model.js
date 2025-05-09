import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
