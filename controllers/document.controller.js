import Document from "../models/Document.model.js";
import Etudiant from "../models/Etudiant.model.js";
import Personnel from "../models/Personnel.model.js";

export const getAllDocuments = async (req, res) => {
  try {
    let documents = await Document.find().populate("typeDocument").lean(); // lean() pour modification directe des objets

    documents = await Promise.all(
      documents.map(async (doc) => {
        let proprietaireData = null;

        if (doc.proprietaireModel === "Etudiant") {
          proprietaireData = await Etudiant.findById(doc.proprietaire)
            .populate("mention")
            .populate("promotion")
            .lean();
        } else if (doc.proprietaireModel === "Personnel") {
          proprietaireData = await Personnel.findById(doc.proprietaire).lean();
        }

        return {
          ...doc,
          proprietaire: proprietaireData,
        };
      })
    );

    res.status(200).json(documents);
  } catch (err) {
    console.error("Erreur récupération documents:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
