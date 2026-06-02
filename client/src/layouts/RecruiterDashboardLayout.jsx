import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Pin,
  BookMarked,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function RecruiterDashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItem = (path, icon, label) => (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
      ${
        location.pathname === path
          ? "bg-surface-container text-primary"
          : "text-gray-400 hover:text-white hover:bg-surface-container-high"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#1c1b1b] border-r border-outline-variant/20 flex flex-col p-6 z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center text-black font-bold">
            <span className="material-symbols-outlined text-on-primary-container text-xl">
              diamond
            </span>
          </div>
          <div>
            <h1 className="font-headline text-lg font-bold text-white">
              CareerConnect
            </h1>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItem("/recruiter", <LayoutDashboard size={18} />, "Dashboard")}
          {navItem("/recruiter/talentpool", <Pin size={18} />, "TalentPool")}
          {navItem(
            "/recruiter/analytics",
            <BookMarked size={18} />,
            "Analytics",
          )}
          {navItem(
            "/recruiter/interviews",
            <MessageCircle size={18} />,
            "Interviews",
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant/20 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 flex items-center justify-between px-8 border-b border-outline-variant/20 bg-background/70 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex justify-between items-center mb-2">
            <input
              placeholder="Search activity..."
              className="bg-[#1a1a1a] border border-white/10 rounded-full px-4 py-2 text-sm w-72"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                onClick={() => setOpenProfile(!openProfile)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              {openProfile && (
                <div className="absolute right-0 mt-3 w-48 bg-surface-container rounded-xl border border-outline-variant/20 p-4 shadow-xl">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-400 mb-3">{user?.email}</p>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 text-sm"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export default RecruiterDashboardLayout;
