import { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/AdminDashboardLayout";

function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    try {
      const { data } = await API.get("/admin/candidates");
      setCandidates(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCandidates();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Candidates</h1>

      <div className="bg-surface-container rounded-[1.5rem] p-6 space-y-4">
        {candidates.length === 0 ? (
          <p className="text-gray-400">No candidates found</p>
        ) : (
          candidates.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                Candidate
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminCandidates;