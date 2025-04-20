// models/Personnel.js
import mongoose from "mongoose";

const personnelSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  postNom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  motDePasse: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Etudiant", "Personnel"],
    default: "Personnel",
  },
  mention: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mention",
  },
});

const Personnel = mongoose.model("Personnel", personnelSchema);
export default Personnel;
