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
          proprietaireData = await Personnel.findById(doc.proprietaire)
            .populate("mention")
            .lean();
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

export const getDocumentsByProprietaire = async (req, res) => {
  const { id } = req.params;

  try {
    const documents = await Document.find({ proprietaire: id }).populate(
      "typeDocument"
    );

    // Populate dynamiquement selon le modèle
    const populatedDocs = await Promise.all(
      documents.map(async (doc) => {
        const model =
          doc.proprietaireModel === "Etudiant" ? Etudiant : Personnel;
        const populatedProprietaire = await model.findById(doc.proprietaire);

        return {
          ...doc.toObject(),
          proprietaire: populatedProprietaire,
        };
      })
    );

    res.status(200).json(populatedDocs);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", err });
  }
};
