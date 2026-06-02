import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getPendingRecruiters, approveRecruiter , rejectRecruiter, deleteJob, getRecentActivity, getJobs, getCandidates} from "../controllers/adminController.js";
import { 
    getDashboardStats,
    getApplicationsPerJob,
    getStatusDistribution
} from "../controllers/adminController.js";         

const router = express.Router();

router.get("/pending-recruiters", protect, authorizeRoles("admin"), getPendingRecruiters);
router.get("/activity", protect, authorizeRoles("admin"), getRecentActivity);
router.put("/approve/:id", protect, authorizeRoles("admin"), approveRecruiter);
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

router.get(
  "/applications-per-job",
  protect,
  authorizeRoles("admin"),
  getApplicationsPerJob
);

router.get(
  "/status-distribution",
  protect,
  authorizeRoles("admin"),
  getStatusDistribution
);
router.get("/jobs", protect, authorizeRoles("admin"), getJobs);
router.get("/candidates", protect, authorizeRoles("admin"), getCandidates);
router.delete("/reject/:id", protect, authorizeRoles("admin"), rejectRecruiter);
router.delete("/delete-job/:id", protect, authorizeRoles("admin"), deleteJob);

export default router;