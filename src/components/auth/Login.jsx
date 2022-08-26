import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";
import "./auth.scss";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const { googleSignIn, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleUserSignIn = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is a required field");
      window.setTimeout(() => setError(null), 4000);
      return;
    }
    if (!password) {
      setError("Password is a required field");
      window.setTimeout(() => setError(null), 4000);
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await googleSignIn();
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="auth">
        <div className="auth__contents">
          <h2>Log in to Employee Expense Management</h2>
          <form onSubmit={handleUserSignIn}>
            {error && <p className="error__message">{error}</p>}
            <label>
              <span>Email:</span>
              <input
                type="email"
                value={email}
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <label>
              <span>Password:</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <br />
            {loading ? (
              <button type="button" disabled>
                <BeatLoader loading={loading} size={10} color={"#fff"} />
              </button>
            ) : (
              <button type="submit">Continue</button>
            )}
            <button
              type="button"
              className="google__btn"
              onClick={signInWithGoogle}
            >
              Continue with Google
            </button>
            <div className="account">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
