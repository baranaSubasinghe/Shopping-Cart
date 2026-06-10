import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const [email, setEmail] = useState('user@example.com'); const [password, setPassword] = useState('123456'); const { login } = useAuth(); const nav = useNavigate();
  const submit = async (e) => { e.preventDefault(); try { await login(email, password); nav('/'); } catch (err) { alert(err.response?.data?.message || 'Login failed'); } };
  return <form className="form" onSubmit={submit}><h2>Login</h2><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /><button>Login</button><p>Google/Facebook/Passkey can be added later with OAuth/passkeys. For now JWT login is included.</p><Link to="/register">Create account</Link></form>;
}
