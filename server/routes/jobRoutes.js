import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { checkRecruiterApproval } from "../middleware/recruiterMiddleware.js";
import {
  createJob,
  getJobs,
  getAllJobs,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();


router.get("/my", protect, getJobs);


router.get("/", getAllJobs);


router.post(
  "/",
  protect,
  authorizeRoles("recruiter"),
  checkRecruiterApproval,
  createJob
);

router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  checkRecruiterApproval,
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  checkRecruiterApproval,
  deleteJob
);

export default router;