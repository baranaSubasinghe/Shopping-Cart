import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!user) return alert("Please login first");
    try {
      setLoading(true);
      await addToCart(product._id, 1);
      alert("Added to cart");
    } catch (error) {
      alert(error.response?.data?.message || "Add to cart failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-body">
        <span className="category">{product.category?.name}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>Rs. {product.price.toFixed(2)}</strong>
          <span>Stock: {product.stock}</span>
        </div>
        <button onClick={handleAdd} disabled={loading || product.stock <= 0}>
          {product.stock <= 0 ? "Out of stock" : loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
