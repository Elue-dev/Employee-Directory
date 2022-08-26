import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";
import { BiUser } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMail } from "react-icons/md";
import "./auth.scss";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
  const nameRef = useRef(null);
  const { googleSignIn, signup, updateName } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const signUpUser = async (e) => {
    e.preventDefault();

    if (!username) {
      setError("Username is a required field");
      window.setTimeout(() => setError(null), 4000);
      return;
    }

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
      await signup(email, password);
      await updateName(username);
      navigate("/");
      setLoading(false);
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        setError("Email already in use");
        window.setTimeout(() => {
          setError("");
        }, 7000);
      }
      if (
        error.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        setError("Password should be at least 6 characters");
        window.setTimeout(() => {
          setError("");
        }, 7000);
      }
      if (error.message === "Firebase: Error (auth/invalid-email).") {
        setError("Invalid email");
        window.setTimeout(() => {
          setError("");
        }, 7000);
      }
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Please check your internet connection");
        window.setTimeout(() => {
          setError("");
        }, 7000);
      }
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await googleSignIn();
      navigate("/")
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handlePasswordVisibility = () => {
    setVisible(!visible);
    if (passwordRef.current.type === "password") {
      passwordRef.current.setAttribute("type", "text");
    } else {
      passwordRef.current.setAttribute("type", "password");
    }
  };

  return (
    <main>
      <div className="auth">
        <div className="auth__contents">
          <h2>Sign up</h2>
          <form onSubmit={signUpUser}>
            {error && <p className="error__message">{error}</p>}
            <label>
              <span>Username:</span>
              <label>
                <div className="auth__icon" style={{ marginBottom: "1rem" }}>
                  <BiUser />
                  <input
                    type="text"
                    value={username}
                    ref={nameRef}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                  />
                </div>
              </label>
            </label>
            <label>
              <span>Email:</span>
              <div className="auth__icon">
                <MdOutlineMail />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </label>
            <br />
            <label>
              <span>Password:</span>
              <div className="password__visibility__toggler">
                <RiLockPasswordLine />
                <input
                  type="password"
                  value={password}
                  ref={passwordRef}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
                <span onClick={handlePasswordVisibility}>
                  {visible ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </span>
              </div>
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
              Have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
