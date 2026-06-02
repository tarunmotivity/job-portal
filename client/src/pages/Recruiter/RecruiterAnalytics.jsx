import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllApplications } from "../../services/applicationService";
import RecruiterDashboardLayout from "../../layouts/RecruiterDashboardLayout";

function Analytics() {
  const [applications, setApplications] = useState([]);

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

  if (applications.length === 0) {
    return (
      <RecruiterDashboardLayout>
        <p className="text-gray-500">No analytics data available</p>
      </RecruiterDashboardLayout>
    );
  }

  
  const jobStats = {};
  applications.forEach((app) => {
    const title = app.job?.title || "Unknown";

    if (!jobStats[title]) {
      jobStats[title] = { total: 0, accepted: 0 };
    }

    jobStats[title].total++;

    if (app.status === "Accepted") {
      jobStats[title].accepted++;
    }
  });

  
  const topJob = Object.entries(jobStats).reduce((a, b) =>
    a[1].total > b[1].total ? a : b
  );

  
  const accepted = applications.filter(a => a.status === "Accepted").length;
  const reviewing = applications.filter(a => a.status === "Reviewing").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;

  
  const insights = [];

  Object.entries(jobStats).forEach(([job, stats]) => {
    const rejectedCount = stats.total - stats.accepted;
    const acceptanceRate = (stats.accepted / stats.total) * 100;

    
    if (stats.total < 2) {
      insights.push({
        type: "warning",
        title: "Low Applicants",
        message: `${job} has only ${stats.total} applicants`,
        details: `
This role is receiving very few applications.

Insights:
• Total Applicants: ${stats.total}
• Acceptance Rate: ${Math.round(acceptanceRate)}%

Suggestions:
• Increase visibility of this job
• Adjust salary or requirements
• Simplify job description
        `,
      });
    }

    
    if (rejectedCount > stats.accepted) {
      insights.push({
        type: "danger",
        title: "High Rejection Rate",
        message: `${job} has ${rejectedCount} rejections`,
        details: `
Many candidates are being rejected.

Insights:
• Total Applicants: ${stats.total}
• Accepted: ${stats.accepted}
• Rejected: ${rejectedCount}
• Acceptance Rate: ${Math.round(acceptanceRate)}%

Suggestions:
• Review candidate filtering criteria
• Adjust job expectations
• Improve job clarity
        `,
      });
    }

    if (acceptanceRate > 50 && stats.total > 2) {
      insights.push({
        type: "success",
        title: "High Performing Role",
        message: `${job} has strong hiring success`,
        details: `
This role is performing well.

Insights:
• Total Applicants: ${stats.total}
• Accepted: ${stats.accepted}
• Acceptance Rate: ${Math.round(acceptanceRate)}%

Suggestions:
• Consider hiring more candidates
• Replicate this job structure
        `,
      });
    }
  });

  
  if (reviewing > accepted) {
    insights.push({
      type: "info",
      title: "Slow Hiring Process",
      message: `${reviewing} candidates are still under review`,
      details: `
Your hiring process is slow.

Insights:
• Reviewing: ${reviewing}
• Accepted: ${accepted}

Suggestions:
• Speed up candidate evaluation
• Schedule interviews faster
      `,
    });
  }

 
  insights.push({
    type: "success",
    title: "Top Performer",
    message: `${topJob[0]} has highest applicants (${topJob[1].total})`,
    details: `
This role is attracting the most candidates.

Insights:
• Applicants: ${topJob[1].total}

Suggestions:
• Analyze why this role performs well
• Apply similar structure to other jobs
    `,
  });

  
  const showInsightDetails = (insight) => {
    Swal.fire({
      title: insight.title,
      html: `<div style="text-align:left; white-space:pre-line;">${insight.details}</div>`,
      confirmButtonColor: "#2563eb",
      width: "500px",
    });
  };

  return (
    <RecruiterDashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">
          📊 Hiring Insights
        </h1>

        
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-500/10 backdrop-blur-lg border border-blue-500/30 p-6 rounded-2xl mb-10 shadow-xl">
          <p className="text-blue-400 text-sm">
            Top Performing Role
          </p>
          <h2 className="text-3xl font-bold mt-1">
            {topJob[0]}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {topJob[1].total} applicants received
          </p>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow hover:scale-105 transition">
            <p className="text-gray-400 text-sm">Total</p>
            <h2 className="text-3xl font-bold">
              {applications.length}
            </h2>
          </div>

          <div className="bg-yellow-500/20 p-6 rounded-xl shadow hover:scale-105 transition">
            <p className="text-yellow-300 text-sm">
              Reviewing
            </p>
            <h2 className="text-3xl font-bold">
              {reviewing}
            </h2>
          </div>

          <div className="bg-green-600/20 p-6 rounded-xl shadow hover:scale-105 transition">
            <p className="text-green-300 text-sm">
              Accepted
            </p>
            <h2 className="text-3xl font-bold">
              {accepted}
            </h2>
          </div>

          <div className="bg-red-600/20 p-6 rounded-xl shadow hover:scale-105 transition">
            <p className="text-red-300 text-sm">
              Rejected
            </p>
            <h2 className="text-3xl font-bold">
              {rejected}
            </h2>
          </div>
        </div>

        
        <div>
          <h2 className="text-xl font-semibold mb-6">
            📈 Job Performance
          </h2>

          <div className="space-y-6">
            {Object.entries(jobStats).map(([job, stats]) => {
              const rate = Math.round(
                (stats.accepted / stats.total) * 100
              );

              return (
                <div
                  key={job}
                  className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-blue-500 transition shadow-lg"
                >
                  <div className="flex justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                      {job}
                    </h3>
                    <span className="text-gray-400 text-sm">
                      {stats.total} applicants
                    </span>
                  </div>

                  <div className="w-full bg-zinc-800 h-3 rounded-full">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                      style={{ width: `${rate}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{stats.accepted} accepted</span>
                    <span>{rate}% success rate</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

       
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-5">
            🧠 Smart Insights
          </h2>

          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div
                key={i}
                onClick={() => showInsightDetails(insight)}
                className={`p-4 rounded-xl border cursor-pointer hover:scale-[1.02] transition ${
                  insight.type === "warning"
                    ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
                    : insight.type === "danger"
                    ? "bg-red-500/10 border-red-500/30 text-red-300"
                    : insight.type === "success"
                    ? "bg-green-500/10 border-green-500/30 text-green-300"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-300"
                }`}
              >
                {insight.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </RecruiterDashboardLayout>
  );
}

export default Analytics;