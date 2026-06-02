import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    salary: {
      type: Number
    },
    company: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    matchScore: {
      type: Number,
      default: 0
    },
    skills : {
      type: [String],
      required: true, 
    },
    category: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);