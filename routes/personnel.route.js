import express from "express";
import {
  loginPersonnel,
  registerPersonnel,
} from "../controllers/personnel.controller.js";

const personnelRoutes = express.Router();

personnelRoutes.post("/register", registerPersonnel);
personnelRoutes.post("/login", loginPersonnel);

export default personnelRoutes;
