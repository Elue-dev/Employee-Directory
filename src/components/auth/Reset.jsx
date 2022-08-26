import { useState, useRef } from "react";
import { MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";

export default function Reset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const passwordRef = useRef();
  const emailRef = useRef(null);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleResetPasssword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      window.setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setEmail("");
      setLoading(false);
      setMessage(
        "Check your inbox for further instructions (Ensure to check spam folder, click on 'Report as not spam and continue from inbox')."
      );
      window.setTimeout(() => {
        setMessage("REDIRECTING...");
      }, 5000);
      window.setTimeout(() => {
        navigate("/login");
      }, 7000);
    } catch (err) {
      if (err.message === "Firebase: Error (auth/user-not-found).") {
        setError("This email is not registered");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      if (err.message === "Firebase: Error (auth/invalid-email).") {
        setError("Invalid email");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      if (err.message === "Firebase: Error (auth/too-many-requests).") {
        setError("Reset password limit exceeded");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      setLoading(false);
    }
  };
  return (
    <div>
      <main>
        <div className="auth">
          <div className="auth__contents">
            <h2>Reset password</h2>
            <div className="reset__info">
              <p>
                If the email goes to your spam folder, click on{" "}
                <b>'Report as not spam'</b>, this will move the mail from spam
                to your inbox. then go to your inbox and continue from there.
              </p>
            </div>

            {error && <p className="error__message">{error}</p>}
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleResetPasssword}>
              <label>
                <span>Email:</span>
                <div className="auth__icon" style={{ marginBottom: ".4rem" }}>
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
              {loading ? (
                <button type="button" disabled>
                  <BeatLoader loading={loading} size={10} color={"#fff"} />
                </button>
              ) : (
                <button type="submit">Continue</button>
              )}
              <div className="account">
                <Link to="/login">Back to Login</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
