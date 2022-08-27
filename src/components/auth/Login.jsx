import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMail } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import "./auth.scss";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
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
      if (error.message === "Firebase: Error (auth/user-not-found).") {
        setError("No user with these credentials exists");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (error.message === "Firebase: Error (auth/wrong-password).") {
        setError("Wrong password");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Please check your internet connection");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Please check your internet connection");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (
        error.message ===
        "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
      ) {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later"
        );
        window.setTimeout(() => {
          setError("");
        }, 12000);
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
          <h2>Log in</h2>
          <form onSubmit={handleUserSignIn}>
            {error && <p className="error__message">{error}</p>}
            <label>
              <span>Email:</span>
              <div className="auth__icon">
                <MdOutlineMail />
                <input
                  type="email"
                  value={email}
                  ref={emailRef}
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
              <Link to="/reset">Forgot Password?</Link>
            </div>
            <div className="account">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
