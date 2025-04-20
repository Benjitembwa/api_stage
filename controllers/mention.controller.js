import Mention from "../models/Mention.model.js";

// Récupérer toutes les mentions
export const getAllMentions = async (req, res) => {
  try {
    const mentions = await Mention.find();
    res.json(mentions);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des mentions",
      error: err.message,
    });
  }
};
