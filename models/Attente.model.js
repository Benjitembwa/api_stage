// models/Attente.js
import mongoose from "mongoose";

const attenteSchema = new mongoose.Schema(
  {
    destinataire: {
      type: String,
      required: true,
    },
    typeDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TypesDocument",
      required: true,
    },
    objet: {
      type: Object,
      required: true,
    },
    proprietaire: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    proprietaireModel: {
      type: String,
      required: true,
      enum: ["Etudiant", "Personnel"],
    },
    status: {
      type: String,
      enum: ["En attente", "Rejeté"],
      default: "En attente",
    },
  },
  { timestamps: true }
);

const Attente = mongoose.model("Attente", attenteSchema);
export default Attente;
