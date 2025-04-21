// routes/documentRoutes.js
import express from "express";
import {
  getAllDocuments,
  getDocumentsByProprietaire,
} from "../controllers/document.controller.js";

const documentRoutes = express.Router();

documentRoutes.get("/", getAllDocuments);
documentRoutes.get("/proprietaire/:id", getDocumentsByProprietaire);

export default documentRoutes;
