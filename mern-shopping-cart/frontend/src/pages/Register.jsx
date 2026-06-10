import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const { register } = useAuth(); const nav = useNavigate();
  const submit = async (e) => { e.preventDefault(); try { await register(name, email, password); nav('/'); } catch (err) { alert(err.response?.data?.message || 'Register failed'); } };
  return <form className="form" onSubmit={submit}><h2>Register</h2><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" /><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /><button>Register</button></form>;
}
