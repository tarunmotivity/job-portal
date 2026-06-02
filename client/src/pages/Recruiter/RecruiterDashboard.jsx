import { useState, useEffect } from "react";
import { createJob, getJobs, deleteJob } from "../../services/recruiterService";
import { Link } from "react-router-dom";
import RecruiterDashboardLayout from "../../layouts/RecruiterDashboardLayout";
import Swal from "sweetalert2";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    category: "",
    skills: [],
  });

  const fetchJobs = async () => {
    try {
      const { data } = await getJobs();
      setJobs(data.jobs || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    //eslint-disable-next-line
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createJob(form);

      Swal.fire({
        title: "Success!",
        text: "Job published successfully 🚀",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      fetchJobs();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This job will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteJob(id);

        Swal.fire({
          title: "Deleted!",
          text: "Job has been removed.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        fetchJobs();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
          icon: "error",
        });
      }
    }
  };

  // 🔍 search filter
  const filteredJobs = (jobs || []).filter((job) =>
    job.title?.toLowerCase().includes(search.toLowerCase()),
  );

  // 📊 total applicants
  const totalApplicants = (jobs || []).reduce(
    (acc, job) => acc + (job.applicantCount || 0),
    0,
  );

  return (
    <RecruiterDashboardLayout>
      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-gray-400 text-sm">Total Jobs</p>
          <h2 className="text-2xl font-bold">{jobs.length}</h2>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-gray-400 text-sm">Total Applicants</p>
          <h2 className="text-2xl font-bold">{totalApplicants}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
     
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Acquire Talent</h1>
          <p className="text-gray-400 mb-6">
            Craft a compelling role to attract the industry's best.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 space-y-4"
          >
            <input
              placeholder="Job Title"
              className="w-full p-3 bg-black border border-zinc-700 rounded-lg"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Company"
                className="p-3 bg-black border border-zinc-700 rounded-lg"
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
              <input
                placeholder="Location"
                className="p-3 bg-black border border-zinc-700 rounded-lg"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Description"
              className="w-full p-3 bg-black border border-zinc-700 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Salary"
                className="p-3 bg-black border border-zinc-700 rounded-lg"
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
              <input
                placeholder="Category"
                className="p-3 bg-black border border-zinc-700 rounded-lg"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <input
              placeholder="Skills (comma separated)"
              className="w-full p-3 bg-black border border-zinc-700 rounded-lg"
              onChange={(e) =>
                setForm({
                  ...form,
                  skills: e.target.value.split(","),
                })
              }
            />

            <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-xl">
              🚀 Publish Job
            </button>
          </form>
        </div>

        
        <div>
          <input
            placeholder="Search jobs..."
            className="mb-4 w-full p-3 bg-black border border-zinc-700 rounded"
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <p>Loading...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-gray-500">No jobs found</p>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 flex justify-between items-center hover:border-blue-500 transition"
                >
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-gray-400 text-sm">{job.company}</p>
                    <p className="text-gray-500 text-xs">{job.location}</p>

                    {/* ✅ FIXED COUNT */}
                    <p className="text-gray-400 text-xs mt-1">
                      {job.applicantCount || 0} Applicants
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/recruiter/applicants/${job._id}`}
                      className="bg-zinc-800 px-3 py-1 rounded"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-500 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RecruiterDashboardLayout>
  );
}

export default RecruiterDashboard;
