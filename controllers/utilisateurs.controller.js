import Etudiant from "../models/Etudiant.model.js";
import Personnel from "../models/Personnel.model.js";

export const getTousUtilisateurs = async (req, res) => {
  try {
    const etudiants = await Etudiant.find()
      .populate("promotion")
      .populate("mention");
    const personnels = await Personnel.find().populate("mention");

    const utilisateursFusionnes = [
      ...etudiants.map((e) => ({ ...e._doc, type: "Etudiant" })),
      ...personnels.map((p) => ({ ...p._doc, type: "Personnel" })),
    ];

    res.status(200).json(utilisateursFusionnes);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
