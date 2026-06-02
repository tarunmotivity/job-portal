import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const createJob = async (req, res, next) => {
  try {
    const { title, description, location, salary, company, skills, category } =
      req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      company,
      matchScore: Math.floor(Math.random() * 20) + 80,
      skills,
      category,
      createdBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({
      createdBy: req.user._id,
      ...keyword,
    })
      .populate("createdBy", "name email")
      .limit(limit)
      .skip(skip);

    const total = await Job.countDocuments({
      createdBy: req.user._id,
      ...keyword,

    });
    console.log(req.user);
    
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({
          job: job._id,
        });

        return {
          ...job.toObject(),
          applicantCount: count,
        };
      }),
    );

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      jobs: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "name email");

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this job");
    }

    Object.assign(job, req.body);
    await job.save();

    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this job");
    }

    await job.deleteOne();

    res.json({ message: "Job removed" });
  } catch (error) {
    next(error);
  }
};
