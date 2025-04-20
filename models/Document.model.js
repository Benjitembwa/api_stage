// models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
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
      type: String,
      required: true,
    },
    proprietaire: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Pas de ref spécifique car peut être un Etudiant ou Personnel
    },
    proprietaireModel: {
      type: String,
      required: true,
      enum: ["Etudiant", "Personnel"],
    },
    codeUnique: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Approuvé"],
    },
    lieuMission: String,
    dateDebut: Date,
    dateFin: Date,
    motifMission: String,
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
