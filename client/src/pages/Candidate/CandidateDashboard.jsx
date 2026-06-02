import { useEffect, useState } from "react";
import { getAllJobs, getSavedJobsAPI, toggleSaveJobAPI, applyJob } from "../../services/jobService";
import API from "../../services/api";
import CandidateDashboardLayout from "../../layouts/CandidateDashboardLayout";
import Swal from "sweetalert2";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(() => {
    return JSON.parse(localStorage.getItem("savedJobs")) || [];
  });
  const [loading, setLoading] = useState(true);

  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await getAllJobs();
      setJobs(data.jobs || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchApplications = async () => {
    try {
      const { data } = await API.get("/applications/my-applications");
      setApplications(data.applications || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  
  const handleApply = async (id) => {
    try {
      await applyJob(id);

      Swal.fire({
        icon: "success",
        title: "Application Sent",
        text: "You applied successfully!",
        confirmButtonColor: "#6366f1",
      });

      fetchApplications();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };


const fetchSavedJobs = async () => {
  try {
    const { data } = await getSavedJobsAPI();

    // only store IDs for easy check
    const ids = data.savedJobs.map((job) => job._id);

    setSavedJobs(ids);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchSavedJobs();
}, []);

  
  const toggleSaveJob = async (jobId) => {
  try {
    const { data } = await toggleSaveJobAPI(jobId);

    setSavedJobs(data.savedJobs);
  } catch (error) {
    console.log(error);
  }
};
  
  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText);

    const matchesCategory =
      activeCategory === "All" ||
      job.category?.toLowerCase().trim() ===
        activeCategory.toLowerCase().trim();

    return matchesSearch && matchesCategory;
  });

  
  const appliedJobIds = applications.map((app) => app.job?._id || app.jobId);

  
  const getPerformanceData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = Array(7).fill(0);

    applications.forEach((app) => {
      const date = new Date(app.createdAt);
      const day = date.getDay();
      const index = day === 0 ? 6 : day - 1;
      counts[index]++;
    });

    return days.map((day, i) => ({
      day,
      applications: counts[i],
    }));
  };

  const performanceChartData = getPerformanceData();

  const thisWeekCount = applications.filter((app) => {
    const now = new Date();
    const appDate = new Date(app.createdAt);

    const diff = (now - appDate) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  return (
    <CandidateDashboardLayout>
      
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-white">
          Find your next <span className="text-blue-400">career stage.</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Curated opportunities for top-tier talent.
        </p>
      </div>

      
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
        <input
          placeholder="Search roles..."
          className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3">
          {["All", "Engineering", "Design", "Product"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full ${
                activeCategory === cat
                  ? "bg-blue-500 text-white"
                  : "bg-[#1a1a1a] text-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      
      {loading ? (
        <p className="text-gray-400">Loading jobs...</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {filteredJobs.map((job) => {
            const alreadyApplied = appliedJobIds.includes(job._id);

            return (
              <div
                key={job._id}
                onClick={() => setSelectedJob(job)}
                className="glow-card bg-[#1a1a1a] p-6 rounded-2xl border hover:border-blue-500 cursor-pointer relative"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job._id);
                  }}
                  className={`absolute top-4 right-4 text-lg ${
                    savedJobs.includes(job._id)
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {savedJobs.includes(job._id) ? "★" : "☆"}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-orange-400/20 px-2 py-1 rounded">
                    {job.matchScore || 85}% Match
                  </span>

                  {savedJobs.includes(job._id) && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      Saved ✓
                    </span>
                  )}
                </div>

                <h2 className="text-white mt-3">{job.title}</h2>

                <p className="text-gray-400 text-sm">
                  {job.company} • {job.location}
                </p>

                <div className="flex gap-2 flex-wrap mt-3">
                  {job.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#2a2a2a] px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-xs text-gray-500">EST. SALARY</p>
                  <p className="text-white font-semibold">
                    ₹{job.salary || "Not disclosed"}
                  </p>
                </div>

                <div className="mt-6">
                  <p className="text-gray-400 text-sm">
                    Posted by: {job.createdBy?.name}
                  </p>

                  <p className="text-gray-500 text-xs">
                    {job.createdBy?.email}
                  </p>
                </div>

                <button
                  disabled={appliedJobIds.includes(job._id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(job._id);
                  }}
                  className={`w-full mt-4 py-2 rounded ${
                    appliedJobIds.includes(job._id)
                      ? "bg-green-600"
                      : "bg-blue-600 hover:scale-[1.02]"
                  }`}
                >
                  {alreadyApplied ? "Applied ✓" : "Apply"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      
      {filteredJobs.length === 0 && !loading && (
        <p className="text-center text-gray-400">No jobs found</p>
      )}

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glow-card md:col-span-2 bg-[#1a1a1a] p-6 rounded-2xl relative">
          <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-4">
            Your Performance
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceChartData}>
              <XAxis dataKey="day" stroke="#888" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "none",
                }}
              />

              <Bar dataKey="applications" radius={[6, 6, 0, 0]}>
                {performanceChartData.map((_, index) => {
                  const today = new Date().getDay();
                  const adjusted = today === 0 ? 6 : today - 1;

                  return (
                    <Cell
                      key={index}
                      fill={index === adjusted ? "#3b82f6" : "#444"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
        </div>

        
        <div className="flex flex-col gap-6">
          
          <div className="glow-card bg-[#151515] p-6 rounded-2xl relative overflow-hidden border border-white/5">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-lg mb-4">
              📄
            </div>

            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Applied Roles
            </p>

            <h2 className="text-4xl font-semibold text-white mt-2">
              {applications.length}
            </h2>

            <p className="text-xs text-green-400 mt-2">
              +{thisWeekCount} this week
            </p>

            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          </div>

          
          <div className="glow-card bg-[#151515] p-6 rounded-2xl relative overflow-hidden border border-white/5">
            <div className="w-10 h-10 bg-purple-500/20 text-purple-400 flex items-center justify-center rounded-lg mb-4">
              🎯
            </div>

            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Interview Invitations
            </p>

            <h2 className="text-4xl font-semibold text-white mt-2">
              {
                applications.filter((a) =>
                  a.status?.toLowerCase().includes("interview"),
                ).length
              }
            </h2>

            <p className="text-xs text-gray-400 mt-2">Check messages</p>

            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-[#1a1a1a] p-6 rounded-xl w-[400px]">
            <h2 className="text-white">{selectedJob.title}</h2>
            <p className="text-gray-400">
              {selectedJob.company} • {selectedJob.location}
            </p>

            <button
              onClick={() => setSelectedJob(null)}
              className="mt-4 bg-red-500 px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </CandidateDashboardLayout>
  );
}

export default CandidateDashboard;
