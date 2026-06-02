import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const role = params.get("role");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      const userData = { token, role, name, email };

      dispatch(setUser(userData)); 

      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "recruiter") navigate("/recruiter");
        else navigate("/candidate");
      }, 100);
    } else {
      navigate("/login");
    }
  }, [location, navigate, dispatch]);

  return <h2 style={{ textAlign: "center" }}>Logging you in...</h2>;
};

export default OAuthSuccess;