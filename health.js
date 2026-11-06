import { Router } from "express";
import { getHealthStatus } from "../services/healthService.js";
const router = Router();
router.get("/", (_req, res) => res.json(getHealthStatus()));
export default router;
