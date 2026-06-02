import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Swal from "sweetalert2";



function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    try {
      await API.post("/auth/register", form);

      Swal.fire({
        icon: "success",
        title: "Welcome aboard!",
        text: "Account created successfully!",
        confirmButtonColor: "#6366f1",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong",
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
               <span
                 className="material-symbols-outlined text-on-primary-container text-xl"
                 style={{
                   fontVariationSettings:
                     "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                 }}
               >
                 diamond
               </span>
             </div>
             <span className="font-headline font-extrabold text-xl tracking-tight text-white">
               CareerConnect
             </span>
           </div>

           <h1 className="font-headline text-5xl font-bold leading-tight text-white mb-6">
             Design your <br />
             <span className="text-primary">professional</span> <br />
             destiny.
           </h1>

           <p className="text-on-surface-variant text-lg max-w-sm leading-relaxed">
             Join the elite network of high-performers and industry leaders.
             Your journey to the next tier begins here.
           </p>
         </div>
       </div>

       <div className="p-8 md:p-16 flex flex-col justify-center">
         <div className="mb-10">
           <h2 className="font-headline text-3xl font-bold text-white mb-2">
             Create Account
           </h2>
           <p className="text-on-surface-variant font-body">
             Already have an account?{" "}
             <span
               onClick={() => navigate("/login")}
               className="text-primary font-semibold hover:underline cursor-pointer"
             >
               Sign In
             </span>
           </p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-3">
             <label className="text-xs font-label font-medium tracking-widest text-on-surface-variant uppercase">
               I want to register as a
             </label>

             <div className="grid grid-cols-2 gap-4">
               <button
                 className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                   form.role === "candidate"
                     ? "bg-surface-container border-2 border-primary ring-4 ring-primary/10"
                     : "bg-surface-container-lowest border-2 border-transparent hover:bg-surface-container"
                 }`}
                 type="button"
                 onClick={() => setForm({ ...form, role: "candidate" })}
               >
                 <span
                   className={`material-symbols-outlined mb-2 ${
                     form.role === "candidate"
                       ? "text-primary"
                       : "text-on-surface-variant"
                   }`}
                   style={{
                     fontVariationSettings:
                       "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                   }}
                 >
                   person
                 </span>
                 <span
                   className={`text-sm font-label font-semibold ${
                     form.role === "candidate"
                       ? "text-white"
                       : "text-on-surface-variant"
                   }`}
                 >
                   Candidate
                 </span>
               </button>

               <button
                 className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                   form.role === "recruiter"
                     ? "bg-surface-container border-2 border-primary ring-4 ring-primary/10"
                     : "bg-surface-container-lowest border-2 border-transparent hover:bg-surface-container"
                 }`}
                 type="button"
                 onClick={() => setForm({ ...form, role: "recruiter" })}
               >
                 <span
                   className={`material-symbols-outlined mb-2 ${
                     form.role === "recruiter"
                       ? "text-primary"
                       : "text-on-surface-variant"
                   }`}
                   style={{
                     fontVariationSettings:
                       "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                   }}
                 >
                   business_center
                 </span>
                 <span
                   className={`text-sm font-label font-semibold ${
                     form.role === "recruiter"
                       ? "text-white"
                       : "text-on-surface-variant"
                   }`}
                 >
                   Recruiter
                 </span>
               </button>
             </div>
           </div>

           <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-xs font-label font-medium tracking-widest text-on-surface-variant uppercase">
                 Full Name
               </label>
               <div className="relative group">
                 <input
                   className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                   placeholder="Name"
                   type="text"
                   value={form.name}
                   onChange={(e) => setForm({ ...form, name: e.target.value })}
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-xs font-label font-medium tracking-widest text-on-surface-variant uppercase">
                 Email
               </label>
               <div className="relative group">
                 <input
                   className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                   placeholder="abc@gmail.com"
                   type="email"
                   value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })}
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-xs font-label font-medium tracking-widest text-on-surface-variant uppercase">
                 Password
               </label>
               <div className="relative group">
                 <input
                   className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                   placeholder="••••••••••••"
                   type={showPassword ? "text" : "password"}
                   value={form.password}
                   onChange={(e) =>
                     setForm({ ...form, password: e.target.value })
                   }
                 />
                 <span
                   className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-on-surface-variant"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? "visibility_off" : "visibility"}
                 </span>
               </div>
             </div>
           </div>

           <div className="flex items-start gap-3">
             <div className="flex items-center h-5">
               <input
                 className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/50"
                 type="checkbox"
               />
             </div>
             <p className="text-xs text-on-surface-variant leading-relaxed">
               By registering, I agree to the{" "}
               <span className="text-primary hover:underline cursor-pointer">
                 Terms of Service
               </span>{" "}
               and{" "}
               <span className="text-primary hover:underline cursor-pointer">
                 Privacy Policy
               </span>
               .
             </p>
           </div>

           <button
             className="w-full premium-gradient py-4 rounded-xl text-on-primary-container font-label font-bold text-sm tracking-wide uppercase shadow-lg shadow-primary/20 active:scale-95 transition-transform hover:shadow-2xl hover:shadow-primary/30"
             type="submit"
           >
             Begin Your Journey
           </button>

           <div className="relative flex items-center justify-center py-2">
             <div className="flex-grow border-t border-outline-variant/30"></div>
             <span className="px-4 text-[10px] font-label font-bold text-outline tracking-[0.2em] uppercase">
               LETS GET GOING
             </span>
             <div className="flex-grow border-t border-outline-variant/30"></div>
           </div>
         </form>
       </div>
     </main>
   </div>
 );
}

export default Register;