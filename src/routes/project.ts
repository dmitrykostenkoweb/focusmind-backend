import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
} from "@/controllers/project";

const router: Router = Router();

router.get("/projects", getAllProjectsController);
router.get("/projects/:id", getProjectByIdController);
router.post("/projects", createProjectController);
router.put("/projects/:id", updateProjectController);
router.delete("/projects/:id", deleteProjectController);

export default router;
