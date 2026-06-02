import { useEffect, useState } from "react";
import {
  getMyApplications,
  withdrawApplicationAPI,
} from "../../services/applicationService";
import CandidateDashboardLayout from "../../layouts/CandidateDashboardLayout";
import Swal from "sweetalert2";

function CandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await getMyApplications();
      setApplications(data.applications || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      case "interview":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  
  const filteredApps = applications.filter((app) => {
    if (activeTab === "All") return true;
    return app.status?.toLowerCase() === activeTab.toLowerCase();
  });

  const handleWithdraw = async (id) => {
    const result = await Swal.fire({
      title: "Withdraw Application?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, withdraw",
    });

    if (result.isConfirmed) {
      try {
        await withdrawApplicationAPI(id);

        setApplications((prev) => prev.filter((app) => app._id !== id));

        Swal.fire("Withdrawn!", "Application removed", "success");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <CandidateDashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">My Applications</h1>
        <p className="text-gray-400 text-sm mt-1">
          Track your job application progress
        </p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {["All", "Applied", "Interview", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-[#1a1a1a] text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-400">Loading applications...</p>}

      {!loading && filteredApps.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          <p>No applications found</p>
          <p className="text-sm mt-2">Start applying to jobs 🚀</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div
            key={app._id}
            className="relative z-0 glow-card bg-[#151515] p-6 rounded-2xl border border-white/10 hover:border-blue-500/40 transition"
          >
            <h2 className="text-white font-semibold text-lg">
              {app.job?.title || "Job Title"}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              {app.job?.company} • {app.job?.location}
            </p>

            <p className="text-gray-500 text-xs mt-3">
              Applied on {new Date(app.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                  app.status,
                )}`}
              >
                {app.status?.toUpperCase()}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWithdraw(app._id);
                }}
                className="relative z-50 text-xs text-red-400 hover:text-red-300"
              >
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>
    </CandidateDashboardLayout>
  );
}

export default CandidateApplications;
