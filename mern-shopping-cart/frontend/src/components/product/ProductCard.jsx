import { useCart } from '../../context/CartContext';
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const handleAdd = async () => { try { await addToCart(product._id, 1); alert('Added to cart'); } catch (e) { alert(e.message); } };
  return <div className="card"><img src={product.image} alt={product.name} /><h3>{product.name}</h3><p>{product.description}</p><p className="cat">{product.category?.name}</p><h4>Rs. {product.price.toFixed(2)}</h4><button disabled={product.stock <= 0} onClick={handleAdd}>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</button></div>;
}
