import express from "express";
import { getAllMentions } from "../controllers/mention.controller.js";

const mentionRoutes = express.Router();

// Récupérer toutes les mentions
mentionRoutes.get("/", getAllMentions);

export default mentionRoutes;
