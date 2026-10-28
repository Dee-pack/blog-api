import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isLogin) await login(username, password);
      else await register(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth">
      <h1>{isLogin ? "Log in" : "Create an account"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={submitting}>{isLogin ? "Log in" : "Register"}</button>
      </form>
      <p>
        {isLogin ? (
          <>
            No account? <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            Already registered? <Link to="/login">Log in</Link>
          </>
        )}
      </p>
    </section>
  );
}
