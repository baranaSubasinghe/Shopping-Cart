import { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/product/ProductCard';
export default function Home() {
  const [products, setProducts] = useState([]); const [categories, setCategories] = useState([]); const [category, setCategory] = useState('');
  useEffect(() => { API.get('/categories').then(r => setCategories(r.data)); }, []);
  useEffect(() => { API.get(`/products${category ? `?category=${category}` : ''}`).then(r => setProducts(r.data)); }, [category]);
  return <><section className="hero"><h1>Online Shopping Cart</h1><p>Browse vegetables, fruits, cakes, biscuits and more.</p></section><div className="filters"><button onClick={() => setCategory('')}>All</button>{categories.map(c => <button key={c._id} onClick={() => setCategory(c._id)}>{c.name}</button>)}</div><div className="grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div></>;
}
