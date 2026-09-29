import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, logout } = useAuth();
  return (
    <>
      <h1>Profile / Settings</h1>
      <div className="panel">
        <dl>
          <div><dt>Name</dt><dd>{user.full_name}</dd></div>
          <div><dt>Username</dt><dd>{user.username}</dd></div>
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          <div><dt>Role</dt><dd>Administrator</dd></div>
        </dl>
        <button className="btn" onClick={logout}>Log out</button>
      </div>
    </>
  );
}
