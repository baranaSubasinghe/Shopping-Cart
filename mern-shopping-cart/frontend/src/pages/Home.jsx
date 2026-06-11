import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/product/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const loadCategories = async () => {
    try {
      const { data } = await API.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("CATEGORY LOAD ERROR:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to load categories"
      );
    }
  };

  const loadProducts = async () => {
    try {
      const { data } = await API.get("/products", {
        params: {
          category,
          search,
        },
      });

      setProducts(data);
    } catch (error) {
      console.error("PRODUCT LOAD ERROR:", error);
      console.log("Request URL:", error.config?.baseURL + error.config?.url);
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to load products"
      );
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  return (
    <main className="container">
      <section className="hero">
        <h1>Online Shopping Cart</h1>
        <p>
          Browse vegetables, fruits, cakes, biscuits and add items to your cart.
        </p>
      </section>

      <section className="filters">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product..."
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </section>
    </main>
  );
};

export default Home;