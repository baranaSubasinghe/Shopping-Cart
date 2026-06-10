import { useCart } from '../context/CartContext';
export default function Cart() {
  const { items, total, updateQty, removeItem, clearCart } = useCart();
  if (!items.length) return <div className="empty"><h2>Your cart is empty</h2></div>;
  return <div><h2>Shopping Cart</h2>{items.map(({ product, quantity }) => <div className="cart-row" key={product._id}><img src={product.image} /><div><h3>{product.name}</h3><p>Rs. {product.price}</p></div><input type="number" min="1" value={quantity} onChange={e => updateQty(product._id, Number(e.target.value))} /><strong>Rs. {(product.price * quantity).toFixed(2)}</strong><button onClick={() => removeItem(product._id)}>Delete</button></div>)}<div className="summary"><h2>Total: Rs. {total.toFixed(2)}</h2><button onClick={clearCart}>Clear Cart</button><button onClick={() => alert('Checkout/payment is future scope')}>Checkout</button></div></div>;
}
