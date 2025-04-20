import Promotion from "../models/Promotion.model.js";

// Récupérer toutes les promotions
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des promotions",
      error: err.message,
    });
  }
};
