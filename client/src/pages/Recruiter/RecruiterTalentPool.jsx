import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../../services/applicationService";
import RecruiterDashboardLayout from "../../layouts/RecruiterDashboardLayout";

function TalentPool() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchApps = async () => {
    try {
      const { data } = await getAllApplications();
      setApplications(data.applications || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApps();
  }, []);

  
  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.candidate?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  
  const accepted = applications.filter(
    (a) => a.status === "Accepted"
  ).length;

  const rejected = applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  const reviewing = applications.filter(
    (a) => a.status === "Reviewing"
  ).length;

  
  const handleUpdate = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);

      Swal.fire({
        title: "Updated!",
        text: `Candidate marked as ${status}`,
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      fetchApps();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update status",
        icon: "error",
      });
    }
  };

  return (
    <RecruiterDashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Talent Pool</h1>

       
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-600/20 p-4 rounded-xl text-center">
            <p className="text-sm text-green-400">Accepted</p>
            <h2 className="text-xl font-bold">{accepted}</h2>
          </div>

          <div className="bg-yellow-500/20 p-4 rounded-xl text-center">
            <p className="text-sm text-yellow-400">Reviewing</p>
            <h2 className="text-xl font-bold">{reviewing}</h2>
          </div>

          <div className="bg-red-600/20 p-4 rounded-xl text-center">
            <p className="text-sm text-red-400">Rejected</p>
            <h2 className="text-xl font-bold">{rejected}</h2>
          </div>
        </div>

        
        <div className="flex gap-4 mb-6">
          <input
            placeholder="Search candidate..."
            className="p-2 bg-black border border-zinc-700 rounded w-full"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-2 bg-black border border-zinc-700 rounded"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Accepted</option>
            <option>Reviewing</option>
            <option>Rejected</option>
          </select>
        </div>

        
        {filteredApps.length === 0 ? (
          <p className="text-gray-500">No applicants found</p>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app._id}
                className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 flex justify-between items-center hover:border-blue-500 transition"
              >
                {/* INFO */}
                <div>
                  <h3 className="font-semibold">
                    {app.candidate?.name}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {app.job?.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    Applied on:{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                      app.status === "Accepted"
                        ? "bg-green-600"
                        : app.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    disabled={app.status === "Accepted"}
                    onClick={() =>
                      handleUpdate(app._id, "Accepted")
                    }
                    className={`px-3 py-1 rounded ${
                      app.status === "Accepted"
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-500"
                    }`}
                  >
                    Accept
                  </button>

                  <button
                    disabled={app.status === "Rejected"}
                    onClick={() =>
                      handleUpdate(app._id, "Rejected")
                    }
                    className={`px-3 py-1 rounded ${
                      app.status === "Rejected"
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-500"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RecruiterDashboardLayout>
  );
}

export default TalentPool;