import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications
} from "../controllers/applicationController.js";

const router = express.Router();


router.post(
  "/apply/:jobId",
  protect,
  authorizeRoles("candidate"),
  applyToJob
);


router.get(
  "/my-applications",
  protect,
  authorizeRoles("candidate"),
  getMyApplications
);


router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter"),
  getApplicantsForJob
);

router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);

router.get("/", protect, getAllApplications);

router.delete("/:id", protect, withdrawApplication);

export default router;