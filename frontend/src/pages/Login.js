import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";

import { loginUser } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    console.log("form-data: ", formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate("/dashboard", { replace: true });
    } catch {
      // The error message is stored in Redux.
      console.log("login error: ", error);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <CheckCircle2 size={58} />
        <h1>TodoPlanner</h1>
        <p>Plan · Organize · Get Things Done</p>

        <div className="brand-illustration">✓</div>

        <span>Your tasks, our priority.</span>
      </section>

      <section className="auth-panel">
        <div className="auth-tabs">
          <span className="auth-tab active">Login</span>
          <Link to="/register" className="auth-tab">
            Register
          </Link>
        </div>

        <h2>Welcome Back!</h2>
        <p className="auth-subtitle">Login to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="youemail@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
