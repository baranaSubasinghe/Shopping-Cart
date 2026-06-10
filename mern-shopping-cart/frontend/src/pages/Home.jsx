import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/product/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    const [productRes, categoryRes] = await Promise.all([
      API.get(`/products?category=${category}&search=${search}`),
      API.get("/categories"),
    ]);
    setProducts(productRes.data);
    setCategories(categoryRes.data);
  };

  useEffect(() => {
    loadData().catch((error) => alert(error.response?.data?.message || "Failed to load products"));
  }, [category, search]);

  return (
    <main className="container">
      <section className="hero">
        <h1>Online Shopping Cart</h1>
        <p>Browse vegetables, fruits, cakes, biscuits and add items to your cart.</p>
      </section>

      <section className="filters">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </section>

      <section className="grid">
        {products.map((product) => <ProductCard key={product._id} product={product} />)}
      </section>
    </main>
  );
};

export default Home;
