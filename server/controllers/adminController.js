import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getPendingRecruiters = async (req, res, next) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
      isApproved: false
    });

    res.json(recruiters);
  } catch (error) {
    next(error);
  }
};


export const approveRecruiter = async (req, res, next) => {
  try {
    const recruiter = await User.findById(req.params.id);

    if (!recruiter || recruiter.role !== "recruiter") {
      res.status(404);
      throw new Error("Recruiter not found");
    }

    recruiter.isApproved = true;
    await recruiter.save();

    res.json({ message: "Recruiter approved successfully" });
  } catch (error) {
    next(error);
  }
};

export const rejectRecruiter = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Recruiter rejected" });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
}

export const deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job removed" });
};

export const getCandidates = async (req, res) => {
  const candidates = await User.find({ role: "candidate" }).select("-password");
  res.json(candidates);
}

export const getRecentActivity = async (req, res) => {
  try {
    const activities = await Application.find()
      .populate("candidate", "name")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    const formatted = activities.map((app) => ({
      user: app.candidate.name,
      action: `Applied for ${app.job.title}`,
      status: app.status,
      time: app.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity" });
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.json({
      totalUsers,
      totalJobs,
      totalApplications
    });
  } catch (error) {
    next(error);
  }
};


export const getApplicationsPerJob = async (req, res, next) => {
  try {
    const data = await Application.aggregate([
      {
        $group: {
          _id: "$job",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      {
        $unwind: "$jobDetails"
      },
      {
        $project: {
          jobTitle: "$jobDetails.title",
          count: 1
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    next(error);
  }
};


export const getStatusDistribution = async (req, res, next) => {
  try {
    const data = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    next(error);
  }
};