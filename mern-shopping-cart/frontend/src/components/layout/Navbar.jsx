import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
export default function Navbar() {
  const { user, logout } = useAuth(); const { items } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return <nav className="nav"><Link className="logo" to="/">FreshCart</Link><div><Link to="/">Products</Link><Link to="/cart">Cart ({count})</Link>{user?.role === 'admin' && <Link to="/admin/products">Admin</Link>}{user ? <button onClick={logout}>Logout</button> : <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}</div></nav>;
}
