import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import DashboardLayout from "../../layouts/AdminDashboardLayout";

function RecruiterApproval() {
  const [recruiters, setRecruiters] = useState([]);

  const fetchRecruiters = async () => {
    try {
      const { data } = await API.get("/admin/pending-recruiters");
      setRecruiters(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);

      Swal.fire({
        icon: "success",
        title: "Approved",
        text: "Recruiter approved successfully",
        confirmButtonColor: "#4d8eff"
      });

      fetchRecruiters();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admin/reject/${id}`);

      Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Recruiter removed",
        confirmButtonColor: "#4d8eff"
      });

      fetchRecruiters();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecruiters();
  }, []);

  return (
    <DashboardLayout>
    <div className="ml-6 pt-18 px-4">

      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Recruiter Approvals
        </h1>
        <p className="text-on-surface-variant text-sm">
          Review and approve recruiter accounts
        </p>
      </div>

   
      <div className="bg-surface-container rounded-[1.5rem] overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-surface-container-low text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {recruiters.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No pending recruiters
                </td>
              </tr>
            ) : (
              recruiters.map((rec) => (
                <tr
                  key={rec._id}
                  className="border-t border-outline-variant/20 hover:bg-surface-container-high/50 transition"
                >
                  <td className="px-6 py-4 text-white">{rec.name}</td>
                  <td className="px-6 py-4 text-gray-400">{rec.email}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {rec.companyName || "—"}
                  </td>

                  <td className="px-6 py-4 flex gap-3">

                    
                    <button
                      onClick={() => handleApprove(rec._id)}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-semibold"
                    >
                      Approve
                    </button>

                    
                    <button
                      onClick={() => handleReject(rec._id)}
                      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition text-sm font-semibold"
                    >
                      Reject
                    </button>

                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>
    </div>
    </DashboardLayout>
  );
}

export default RecruiterApproval;