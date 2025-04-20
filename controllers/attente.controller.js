import Attente from "../models/Attente.model.js";
import Document from "../models/Document.model.js";
import Etudiant from "../models/Etudiant.model.js";
import Personnel from "../models/Personnel.model.js";
import { nanoid } from "nanoid";

export const creerAttente = async (req, res) => {
  try {
    const {
      destinataire,
      typeDocument,
      objet,
      proprietaire,
      proprietaireModel,
      lieuMission,
      dateDebut,
      dateFin,
      motifMission,
    } = req.body;

    if (!destinataire || !typeDocument || !objet || !proprietaire) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    if (!["Etudiant", "Personnel"].includes(proprietaireModel)) {
      return res
        .status(400)
        .json({ message: "Modèle de propriétaire invalide" });
    }

    const nouvelleAttente = new Attente({
      destinataire,
      typeDocument,
      objet,
      proprietaire,
      proprietaireModel,
      lieuMission,
      dateDebut,
      dateFin,
      motifMission,
    });

    await nouvelleAttente.save();
    res
      .status(201)
      .json({ message: "Demande enregistrée", attente: nouvelleAttente });
  } catch (error) {
    console.error("Erreur lors de la création de la demande :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const getAttentesParUtilisateur = async (req, res) => {
  const { userId } = req.params;

  try {
    const attentes = await Attente.find({ proprietaire: userId }).populate(
      "typeDocument"
    );

    // Peupler manuellement chaque proprietaire selon le modèle
    const attentesAvecProprietaire = await Promise.all(
      attentes.map(async (attente) => {
        let proprietaireDetails = null;

        if (attente.proprietaireModel === "Etudiant") {
          proprietaireDetails = await Etudiant.findById(attente.proprietaire);
        } else if (attente.proprietaireModel === "Personnel") {
          proprietaireDetails = await Personnel.findById(attente.proprietaire);
        }

        return {
          ...attente.toObject(),
          proprietaire: proprietaireDetails,
        };
      })
    );

    res.status(200).json(attentesAvecProprietaire);
  } catch (error) {
    console.error("Erreur lors de la récupération des attentes :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const getAttentesEnAttente = async (req, res) => {
  try {
    // Récupérer les attentes avec le statut "En attente" et peupler typeDocument
    const attentes = await Attente.find({ status: "En attente" }).populate(
      "typeDocument"
    );

    // Peupler manuellement chaque proprietaire selon le modèle spécifié
    const attentesAvecProprietaire = await Promise.all(
      attentes.map(async (attente) => {
        let proprietaireDetails = null;

        if (attente.proprietaireModel === "Etudiant") {
          proprietaireDetails = await Etudiant.findById(attente.proprietaire);
        } else if (attente.proprietaireModel === "Personnel") {
          proprietaireDetails = await Personnel.findById(attente.proprietaire);
        }

        return {
          ...attente.toObject(),
          proprietaire: proprietaireDetails,
        };
      })
    );

    res.status(200).json(attentesAvecProprietaire);
  } catch (error) {
    console.error("Erreur lors de la récupération des attentes :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des attentes",
      error: error.message,
    });
  }
};

export const approuverAttente = async (req, res) => {
  try {
    const { id } = req.params;

    const attente = await Attente.findById(id).populate("typeDocument");

    if (!attente) {
      return res.status(404).json({ message: "Demande non trouvée." });
    }

    // Création du document avec les données d'attente
    const nouveauDocument = new Document({
      destinataire: attente.destinataire,
      typeDocument: attente.typeDocument._id,
      objet: attente.objet,
      proprietaire: attente.proprietaire,
      proprietaireModel: attente.proprietaireModel,
      codeUnique: nanoid(8),
      status: "Approuvé",
      lieuMission: attente.lieuMission,
      dateDebut: attente.dateDebut,
      dateFin: attente.dateFin,
      motifMission: attente.motifMission,
    });

    await nouveauDocument.save();
    await attente.deleteOne();

    res.status(201).json({ message: "Document approuvé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'approbation." });
  }
};

export const rejeterAttente = async (req, res) => {
  try {
    const { id } = req.params;

    const attente = await Attente.findById(id);
    if (!attente)
      return res.status(404).json({ message: "Demande introuvable" });

    attente.status = "Rejeté";
    await attente.save();

    res.status(200).json({ message: "Demande rejetée avec succès", attente });
  } catch (error) {
    console.error("Erreur lors du rejet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
