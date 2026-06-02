import { useEffect, useState } from "react";
import { getSavedJobsAPI, toggleSaveJobAPI } from "../../services/jobService";
import CandidateDashboardLayout from "../../layouts/CandidateDashboardLayout";
function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);

  const fetchSavedJobs = async () => {
    const { data } = await getSavedJobsAPI();
    setSavedJobs(data.savedJobs || []);
    console.log(data);
  };

  useEffect(() => {
    //eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSavedJobs();
  }, []);


  const removeJob = async (jobId) => {
    await toggleSaveJobAPI(jobId);
    fetchSavedJobs();
  };

  return (
    <CandidateDashboardLayout>
    <div>
      <h1 className="text-2xl text-white mb-6">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <p className="text-gray-400">No saved jobs yet ⭐</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <div
              key={job._id}
              className="glow-card bg-[#1a1a1a] p-6 rounded-2xl relative"
            >
              <button
                onClick={() => removeJob(job._id)}
                className="absolute top-4 right-4 text-red-400"
              >
                ✕
              </button>

              <h2 className="text-white">{job.title}</h2>

              <p className="text-gray-400 text-sm">
                {job.company} • {job.location}
              </p>

              <div className="flex gap-2 mt-3 flex-wrap">
                {job.skills?.map((skill, i) => (
                  <span key={i} className="text-xs bg-[#2a2a2a] px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-gray-400 mt-3 text-sm">
                ₹{job.salary || "Not disclosed"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    </CandidateDashboardLayout>
  );
}

export default SavedJobs;