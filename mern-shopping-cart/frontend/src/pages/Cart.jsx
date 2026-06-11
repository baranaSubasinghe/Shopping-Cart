import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="container empty">
        <h2>Please login to view your cart</h2>
        <Link to="/login" className="primary-link">Login</Link>
      </main>
    );
  }

  if (!cart.items?.length) {
    return (
      <main className="container empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="primary-link">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Your Cart</h1>
      <section className="cart-layout">
        <div className="cart-list">
          {cart.items.map((item) => (
            <div className="cart-item" key={item.product._id}>
              <img src={item.product.image} alt={item.product.name} />
              <div>
                <h3>{item.product.name}</h3>
                <p>Rs. {item.product.price.toFixed(2)}</p>
                <label>
                  Qty:
                  <input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product._id, e.target.value).catch((error) => alert(error.response?.data?.message || "Update failed"))}
                  />
                </label>
              </div>
              <strong>Rs. {(item.product.price * item.quantity).toFixed(2)}</strong>
              <button className="danger" onClick={() => removeFromCart(item.product._id)}>Remove</button>
            </div>
          ))}
        </div>
        <aside className="summary">
          <h2>Order Summary</h2>
          <p>Total Items: {cart.totalItems}</p>
          <h3>Total: Rs. {cart.totalPrice?.toFixed(2)}</h3>
          <button onClick={() => navigate("/checkout")}>
  Checkout
</button>
          <button className="danger outline" onClick={clearCart}>Clear Cart</button>
        </aside>
      </section>
    </main>
  );
};

export default Cart;
