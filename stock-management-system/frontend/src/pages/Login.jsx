import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../services/api';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(username, password);
      nav('/');
    } catch (e2) {
      setErr(errMsg(e2));
    }
    setBusy(false);
  };

  return (
    <div className="login">
      <form className="login-box" onSubmit={submit}>
        <h1>Stock Manager</h1>
        <p className="muted">Sign in to manage your inventory.</p>
        {err && <div className="alert bad">{err}</div>}
        <label>Username or email
          <input required value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </label>
        <label>Password
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn full" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  );
}
