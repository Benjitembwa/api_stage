// routes/documentRoutes.js
import express from "express";
import { getAllDocuments } from "../controllers/document.controller.js";

const documentRoutes = express.Router();

documentRoutes.get("/", getAllDocuments);

export default documentRoutes;
