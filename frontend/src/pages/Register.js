import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";

import { registerUser } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(registerUser(formData)).unwrap();
      navigate("/dashboard", { replace: true });
    } catch {
      // The error message is stored in Redux.
      console.log("register error:", error);
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
          <Link to="/login" className="auth-tab">
            Login
          </Link>
          <span className="auth-tab active">Register</span>
        </div>

        <h2>Create Account</h2>
        <p className="auth-subtitle">Sign up to start organizing your tasks</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
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
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={6}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
};

export default Register;
