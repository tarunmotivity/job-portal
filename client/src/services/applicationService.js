import API from "./api";

export const getAllApplications = () => API.get("/applications");

export const getApplications = (jobId) => API.get(`/applications/job/${jobId}`);

export const getApplicants = (jobId) => API.get(`/applications/job/${jobId}`);

export const updateApplicationStatus = (id, status) =>
  API.put(`/applications/${id}`, { status });

export const getMyApplications = () => API.get("/applications/my-applications");

export const withdrawApplicationAPI=(id) => API.delete(`/applications/${id}`);