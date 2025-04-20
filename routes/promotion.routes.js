import express from "express";
import { getAllPromotions } from "../controllers/promotion.controller.js";

const promotionRoutes = express.Router();

// Récupérer toutes les promotions
promotionRoutes.get("/", getAllPromotions);

export default promotionRoutes;
