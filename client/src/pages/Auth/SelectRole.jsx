import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import API from "../../services/api";

const SelectRole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const chooseRole = async (role) => {
    const token = new URLSearchParams(window.location.search).get("token");

    try {
      await API.post(
        "/users/set-role",
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = { token, role };

      dispatch(setUser(userData)); // ✅ Redux

      if (role === "recruiter") navigate("/recruiter");
      else navigate("/candidate");

    } catch (err) {
      console.error("Role error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <div className="bg-[#111827] p-10 rounded-2xl shadow-xl w-[400px] text-center">
        <h1 className="text-2xl font-bold mb-2">Choose Your Role</h1>
        <p className="text-gray-400 mb-6">
          Select how you want to use the platform
        </p>

        <div
          onClick={() => chooseRole("candidate")}
          className="cursor-pointer mb-4 p-4 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-[#1f2937] transition-all"
        >
          <h2 className="text-lg font-semibold">👨‍💻 Candidate</h2>
          <p className="text-sm text-gray-400">
            Apply for jobs and track applications
          </p>
        </div>

        <div
          onClick={() => chooseRole("recruiter")}
          className="cursor-pointer p-4 rounded-xl border border-gray-700 hover:border-green-500 hover:bg-[#1f2937] transition-all"
        >
          <h2 className="text-lg font-semibold">🏢 Recruiter</h2>
          <p className="text-sm text-gray-400">
            Post jobs and manage candidates
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;