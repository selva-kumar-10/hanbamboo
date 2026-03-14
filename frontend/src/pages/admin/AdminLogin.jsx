import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <main className="al-page">
        <div className="al-card">

          <div className="al-logo">
            <span className="al-logo-icon">🎍</span>
            <div>
              <div className="al-logo-name">HanBamboo</div>
              <div className="al-logo-sub">Admin Panel</div>
            </div>
          </div>

          <h1 className="al-title">Sign in</h1>
          <p className="al-subtitle">Manage your products and orders.</p>

          {error && <div className="al-error">{error}</div>}

          {/*
            Prevent browser autofill:
            1. autoComplete="off" on form
            2. autoComplete="new-password" on inputs (tricks browsers)
            3. Hidden dummy fields so browser fills those instead
          */}
          <form onSubmit={handleSubmit} autoComplete="off" className="al-form">
            <input type="text"     autoComplete="username"     style={{display:"none"}} readOnly tabIndex={-1} />
            <input type="password" autoComplete="new-password" style={{display:"none"}} readOnly tabIndex={-1} />

            <div className="al-field">
              <label className="al-label">Email address</label>
              <input
                type="email"
                className="al-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <div className="al-pass-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  className="al-input al-pass-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="al-pass-toggle"
                  onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

const CSS = `
  .al-page {
    min-height: 100vh;
    background: var(--cream-dark);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
  }
  .al-card {
    background: var(--white);
    border-radius: 20px;
    padding: 40px 36px;
    width: 100%; max-width: 400px;
    box-shadow: 0 8px 40px rgba(28,58,42,.12);
  }
  .al-logo {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 32px; justify-content: center;
  }
  .al-logo-icon {
    width: 44px; height: 44px;
    background: var(--green); border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .al-logo-name {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 600; color: var(--green);
  }
  .al-logo-sub {
    font-size: 10px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--terra);
  }
  .al-title {
    font-family: var(--font-display);
    font-size: 1.8rem; font-weight: 500; color: var(--green);
    text-align: center; margin-bottom: 4px;
  }
  .al-subtitle { font-size: 13px; color: var(--muted); text-align: center; margin-bottom: 28px; }
  .al-error {
    background: #FEE8E8; border: 1px solid #FECDCD;
    color: #C84B31; padding: 11px 14px; border-radius: 10px;
    font-size: 13px; font-weight: 600; margin-bottom: 20px;
  }
  .al-form { display: flex; flex-direction: column; gap: 18px; }
  .al-field { display: flex; flex-direction: column; gap: 6px; }
  .al-label { font-size: 12px; font-weight: 700; color: var(--green); }
  .al-input {
    padding: 12px 14px; border: 1.5px solid var(--border);
    border-radius: 10px; font-family: var(--font-body);
    font-size: 14px; color: var(--brown); background: var(--cream);
    outline: none; transition: border-color .2s; width: 100%;
  }
  .al-input:focus { border-color: var(--green); background: var(--white); }
  .al-pass-wrap { position: relative; }
  .al-pass-input { padding-right: 56px; }
  .al-pass-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    font-size: 12px; font-weight: 700; color: var(--muted);
    transition: color .15s; background: none; border: none; cursor: pointer;
  }
  .al-pass-toggle:hover { color: var(--green); }
  .al-submit {
    width: 100%; padding: 14px; border-radius: 50px;
    background: var(--green); color: var(--cream);
    font-family: var(--font-body); font-size: 15px; font-weight: 700;
    border: none; cursor: pointer; transition: all .2s; margin-top: 4px;
  }
  .al-submit:hover:not(:disabled) { background: var(--green-mid); transform: translateY(-1px); }
  .al-submit:disabled { opacity: .6; cursor: not-allowed; }
`;

export default AdminLogin;