import { Router } from "express";
import {
  getAllProjectsController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from "@/controllers/project";

const router: Router = Router();

router.get("/projects", getAllProjectsController);
router.get("/projects/:id", getProjectByIdController);
router.post("/projects", createProjectController);
router.put("/projects/:id", updateProjectController);
router.delete("/projects/:id", deleteProjectController);

export default router;
