import { Router } from "express";
import {
  getAllProjectsController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
  updateProjectStatusController,
} from "@/controllers/project";

const router: Router = Router();

router.get("/projects", getAllProjectsController);
router.get("/projects/:id", getProjectByIdController);
router.post("/projects", createProjectController);
router.put("/projects/:id", updateProjectController);
router.delete("/projects/:id", deleteProjectController);
router.patch("/projects/:id/status", updateProjectStatusController);

export default router;
