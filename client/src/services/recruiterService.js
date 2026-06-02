import API from "./api";


export const createJob = (jobData) => API.post("/jobs", jobData);

export const getJobs = () => API.get("/jobs/my");
export const deleteJob = (id) => API.delete(`/jobs/${id}`);