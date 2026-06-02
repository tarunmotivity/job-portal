import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";

import Swal from "sweetalert2";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    try {
      const { data } = await API.post("/auth/login", form);
      dispatch(setUser(data));

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "recruiter") navigate("/recruiter");
      else navigate("/candidate");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid credentials",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-[1100px] grid md:grid-cols-2 bg-surface-container-low rounded-[2rem] overflow-hidden shadow-2xl shadow-black/60 ghost-border">
        
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-surface-container overflow-hidden">
          
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-tertiary/10 blur-[80px] rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-xl">
                  diamond
                </span>
              </div>
              <span className="font-headline font-extrabold text-xl text-white">
                CareerConnect
              </span>
            </div>

            <h1 className="font-headline text-5xl font-bold leading-tight text-white mb-6">
              Manage hiring <br />
              <span className="text-primary">the smart way</span>
            </h1>

            <p className="text-on-surface-variant text-lg max-w-sm">
              CareerConnect helps you manage candidates, track progress and
              analyze recruitment performance.
            </p>
          </div>
        </div>

        
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <h2 className="font-headline text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>

            <p className="text-on-surface-variant">
              Login to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-label tracking-widest text-on-surface-variant uppercase">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="abc@gmail.com"
                className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            
            <div className="space-y-2">
              <label className="text-xs font-label tracking-widest text-on-surface-variant uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-on-surface-variant"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </div>
            </div>

            
            <button
              type="submit"
              className="w-full premium-gradient py-4 rounded-xl text-on-primary-container font-label font-bold text-sm tracking-wide uppercase shadow-lg shadow-primary/20 active:scale-95 transition-transform hover:shadow-2xl hover:shadow-primary/30"
            >
              Login
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="px-4 text-[10px] font-label font-bold text-outline uppercase tracking-widest">
                Or continue with
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = "http://localhost:5000/api/auth/google";
              }}
              className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-on-surface font-label font-medium tracking-wide transition-all hover:bg-surface-container hover:shadow-lg hover:shadow-black/20 active:scale-[0.98]"
            >
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 
      12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 
      20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 12 24 12c3.1 0 5.9 1.2 
      8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.1 0 9.8-2 13.4-5.3l-6.2-5.1C29.1 35.8 26.7 36.9 
      24 36.9c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.6 39.7 16.3 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.4-6.6 
      6.6l6.2 5.1C39.5 36.6 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Continue with Google
            </button>
            
            <p className="text-center text-on-surface-variant text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-primary cursor-pointer hover:underline"
              >
                Register
              </span>
            </p>

            <div className="relative flex items-center justify-center py-2">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="px-4 text-[10px] font-label font-bold text-outline uppercase tracking-widest">
                Secure Login
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
