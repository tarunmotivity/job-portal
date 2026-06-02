import express from "express";
import {
  toggleSaveJob,
  getSavedJobs,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();


router.post("/set-role", protect, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);

    const { role } = req.body;

   
    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    
    const user = req.user;

    user.role = role;

    if (role === "recruiter") {
      user.isApproved = false;
    } else {
      user.isApproved = true;
    }

    await user.save();

    res.json({
      message: "Role updated successfully",
      role: user.role,
    });

  } catch (error) {
    console.error("SET ROLE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});


router.post("/save-job/:jobId", protect, toggleSaveJob);


router.get("/saved-jobs", protect, getSavedJobs);

export default router;