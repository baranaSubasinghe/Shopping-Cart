import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProducts from './pages/AdminProducts';
import { useAuth } from './context/AuthContext';
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/login" />;
};
export default function App() {
  return <><Navbar /><main className="container"><Routes><Route path="/" element={<Home />} /><Route path="/cart" element={<Cart />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} /></Routes></main></>;
}
