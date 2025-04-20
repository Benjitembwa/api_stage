import express from "express";
import { getTousUtilisateurs } from "../controllers/utilisateurs.controller.js";

const utilisateursRoutes = express.Router();

utilisateursRoutes.get("/tous", getTousUtilisateurs);

export default utilisateursRoutes;
