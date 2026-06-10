import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className="navbar">
      <Link to="/" className="brand">FreshCart</Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/cart">Cart ({cart.totalItems || 0})</NavLink>
        {user?.role === "admin" && <NavLink to="/admin/products">Admin</NavLink>}
        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          <button onClick={logout} className="logout">Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
