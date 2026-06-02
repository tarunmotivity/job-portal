import { useEffect, useState} from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/AdminDashboardLayout";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  const [applicationsPerJob, setApplicationsPerJob] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [activity, setActivity] = useState([]);
  

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplicationsPerJob = async () => {
    try {
      const { data } = await API.get("/admin/applications-per-job");
      setApplicationsPerJob(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStatusDistribution = async () => {
    try {
      const { data } = await API.get("/admin/status-distribution");
      console.log(data);
      setStatusDistribution(data);
      
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActivity = async () => {
  const { data } = await API.get("/admin/activity");
  setActivity(data);
};



  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    fetchApplicationsPerJob();
    fetchStatusDistribution();
    fetchActivity();
  }, []);

  return (
    <DashboardLayout>
    <div className="bg-[#0f0f0f] text-white min-h-screen flex">
     

   
      <div className="flex-1 p-8">
        

        
        <div className="flex gap-8 mb-8 text-sm">
          <span className="text-white border-b-2 border-blue-500 pb-2">
            Overview
          </span>
          
        </div>

        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl flex justify-between">
            <div>
              <p className="text-xs text-gray-400">TOTAL USERS</p>
              <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
              <p className="text-xs text-gray-500 mt-1">Active now</p>
            </div>
            <div className="text-right">
              <p className="mt-3 material-symbols-outlined">group</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl flex justify-between">
            <div>
              <p className="text-xs text-gray-400">ACTIVE JOBS</p>
              <h2 className="text-3xl font-bold">{stats.totalJobs}</h2>
              <p className="text-xs text-gray-500 mt-1">Across countries</p>
            </div>
            <div className="text-right">
              <p className="mt-3 material-symbols-outlined">work</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl flex justify-between">
            <div>
              <p className="text-xs text-gray-400">APPLICATIONS</p>
              <h2 className="text-3xl font-bold">{stats.totalApplications}</h2>
              <p className="text-xs text-orange-400 mt-1">High demand</p>
            </div>
            <div className="text-right">
              <p className="mt-3 material-symbols-outlined">description</p>
            </div>
          </div>
        </div>

        
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          
          <div className="lg:col-span-2 bg-[#1a1a1a] p-6 rounded-2xl">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Applications per Job</h2>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsPerJob}>
                <XAxis dataKey="jobTitle" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="count" fill="#8fa8ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          
          <div className="bg-[#1a1a1a] p-6 rounded-2xl relative">
            <h2 className="text-lg font-semibold mb-4">Application Status</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={["#8fa8ff", "#ffb787", "#333"][index % 3]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
          <div className="p-6 flex justify-between">
            <h2 className="text-lg font-semibold">Recent System Activity</h2>
            <span className="text-sm text-blue-400 cursor-pointer">
              View All Logs
            </span>
          </div>

          <table className="w-full text-sm">
            <thead className="text-gray-400 border-t border-white/10">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Action</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Time</th>
              </tr>
            </thead>

            <tbody>
              {activity.map((item, index) => (
                <tr key={index} className="border-t border-outline-variant/20">
                  <td className="px-6 py-4 text-white">{item.user}</td>
                  <td className="px-6 py-4 text-gray-400">{item.action}</td>
                  <td className="px-6 py-4 text-primary">{item.status}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(item.time).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
  );

}

export default AdminDashboard;