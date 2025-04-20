import express from "express";
import { loginAdmin } from "../controllers/admin.controller.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", loginAdmin);

export default adminRoutes;
