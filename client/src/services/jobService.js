import API from "./api";

export const getAllJobs = () => API.get("/jobs");

export const toggleSaveJobAPI = (jobId) =>
  API.post(`/users/save-job/${jobId}`);

export const applyJob = (jobId) =>
  API.post(`/applications/apply/${jobId}`);

export const getSavedJobsAPI = () =>
  API.get("/users/saved-jobs");