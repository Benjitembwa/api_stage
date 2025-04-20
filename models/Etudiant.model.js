// models/Etudiant.js
import mongoose from "mongoose";

const etudiantSchema = new mongoose.Schema({
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
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion",
    required: true,
  },
  mention: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mention",
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
    default: "Etudiant",
  },
});

const Etudiant = mongoose.model("Etudiant", etudiantSchema);
export default Etudiant;
