import { useEffect, useState} from "react";
import { getApplicants, updateApplicationStatus } from "../../services/applicationService";
import { useParams } from "react-router-dom";

function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = async () => {
    try {
      const { data } = await getApplicants(jobId);
      setApplicants(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplicants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      fetchApplicants();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Applicants</h1>

      <div className="space-y-4">
        {applicants.map((app) => (
          <div
            key={app._id}
            className="bg-zinc-900 p-5 rounded border border-zinc-800"
          >
            <h2 className="text-xl">{app.candidate.name}</h2>
            <p>{app.candidate.email}</p>

            {app.candidate.resume && (
              <a
                href={`http://localhost:5000/${app.candidate.resume}`}
                target="_blank"
                className="text-blue-400"
              >
                View Resume
              </a>
            )}

            <p className="mt-2 text-gray-400">
              Status: {app.status}
            </p>

            <div className="mt-3 space-x-2">
              <button
                onClick={() => updateStatus(app._id, "Shortlisted")}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Shortlist
              </button>

              <button
                onClick={() => updateStatus(app._id, "Rejected")}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applicants;