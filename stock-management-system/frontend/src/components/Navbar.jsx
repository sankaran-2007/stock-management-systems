import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ toggle }) {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <button className="btn ghost menu-btn" onClick={toggle}>☰</button>
      <strong>Stock Management System</strong>
      <div className="nav-right">
        <span>{user?.full_name}</span>
        <button className="btn ghost" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
