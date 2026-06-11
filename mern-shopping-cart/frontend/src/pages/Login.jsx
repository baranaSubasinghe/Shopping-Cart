import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { startAuthentication } from "@simplewebauthn/browser";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("123456");

  const { login, saveUser } = useAuth();
  const navigate = useNavigate();

  const apiRoot = (
    import.meta.env.VITE_API_URL || "http://localhost:5001/api"
  ).replace(/\/api\/?$/, "");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const passkeyLogin = async () => {
    try {
      if (!email) {
        alert("Enter email first");
        return;
      }

      const { data: options } = await API.post("/auth/passkey/login-options", {
        email,
      });

      const authenticationResponse = await startAuthentication({
        optionsJSON: options,
      });

      const { data } = await API.post("/auth/passkey/login-verify", {
        email,
        credential: authenticationResponse,
      });

      saveUser(data);
      alert("Passkey login successful");
      navigate("/");
    } catch (err) {
      console.error("Passkey login error:", err);
      alert(err.response?.data?.message || err.message || "Passkey login failed");
    }
  };

  return (
    <main className="form-page">
      <form onSubmit={submit} className="form">
        <h2>Login</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">Login</button>

        <button type="button" className="outline" onClick={passkeyLogin}>
          Login with Passkey
        </button>

        <a className="outline linkbtn" href={`${apiRoot}/api/auth/google`}>
          Login with Google
        </a>

        <a className="outline linkbtn" href={`${apiRoot}/api/auth/facebook`}>
          Login with Facebook
        </a>

        <p>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}