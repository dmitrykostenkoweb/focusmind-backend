import { Router } from "express";
import {
  getAllAreasController,
  getAreaByIdController,
  createAreaController,
  updateAreaController,
  deleteAreaController,
} from "@/controllers/areaController";

const router: Router = Router();

router.get("/areas", getAllAreasController);
router.get("/areas/:id", getAreaByIdController);
router.post("/areas", createAreaController);
router.put("/areas/:id", updateAreaController);
router.delete("/areas/:id", deleteAreaController);

export default router;
