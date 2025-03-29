import express from "express";
const router = express.Router();
import { getAllBestsellers } from "../controllers/bestsellersController.js";

router.get("/", getAllBestsellers);

export default router;