import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProducts from "./pages/AdminProducts";
import OAuthSuccess from "./pages/OAuthSuccess";
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/products" element={<AdminProducts />} />
         <Route path="/checkout" element={<Checkout />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
