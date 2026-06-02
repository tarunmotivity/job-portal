import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/AdminDashboardLayout";
import Swal from "sweetalert2";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = useCallback(async () => {
    try {
      const { data } = await API.get("/admin/jobs");
      setJobs(data);
    
    } catch (err) {
      console.log(err);
    }
  }, []);

  const deleteJob = async (id) => {
    try {
      await API.delete(`/admin/jobs/${id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Job removed successfully",
        confirmButtonColor: "#4d8eff",
      });

      fetchJobs();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, [fetchJobs]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Job Board</h1>

      <div className="bg-surface-container rounded-[1.5rem] p-6 space-y-4">
        {jobs.length === 0 ? (
          <p className="text-gray-400">No jobs found</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl"
            >
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-gray-400">{job.company}</p>
              </div>

              <button
                onClick={() => deleteJob(job._id)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminJobs;