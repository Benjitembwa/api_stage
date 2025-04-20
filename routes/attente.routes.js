import express from "express";
import {
  approuverAttente,
  creerAttente,
  getAttentesEnAttente,
  getAttentesParUtilisateur,
  rejeterAttente,
} from "../controllers/attente.controller.js";

const attenteRoutes = express.Router();

attenteRoutes.post("/", creerAttente);
attenteRoutes.get("/enAttente", getAttentesEnAttente);
attenteRoutes.get("/:userId", getAttentesParUtilisateur);
attenteRoutes.post("/approuver/:id", approuverAttente);
attenteRoutes.post("/:id/rejeter", rejeterAttente); // Nouvelle route

export default attenteRoutes;
