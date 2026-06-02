import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    const alreadyApplied = await Application.findOne({
      job: job._id,
      candidate: req.user._id,
    });

    if (alreadyApplied) {
      res.status(400);
      throw new Error("You already applied to this job");
    }

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    }).populate("job"); 

    res.status(200).json({
      applications,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicantsForJob = async (req, res, next) => {
  try {
    const applications = await Application.find({
      job: req.params.jobId,
    }).populate("candidate", "name email skills resume");

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    application.status = req.body.status;
    await application.save();

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const ownerId =
      application.applicant ||
      application.user ||
      application.candidate;

    if (!ownerId) {
      return res.status(400).json({ message: "Invalid application data" });
    }

    if (ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application withdrawn",
    });
  } catch (error) {
    console.log("Withdraw error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "job",
        match: { createdBy: req.user._id }, // 🔥 filter here
        select: "title",
      })
      .populate("candidate", "name email");

    
    const filtered = applications.filter((app) => app.job);

    res.json({ applications: filtered });
  } catch (error) {
    next(error);
  }
};