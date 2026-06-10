import { useEffect, useState } from 'react';
import API from '../api/axios';
const blank = { name:'', description:'', price:'', image:'', category:'', stock:'' };
export default function AdminProducts() {
  const [products, setProducts] = useState([]), [categories, setCategories] = useState([]), [form, setForm] = useState(blank), [editId, setEditId] = useState(null);
  const load = async () => { setProducts((await API.get('/products')).data); setCategories((await API.get('/categories')).data); };
  useEffect(() => { load(); }, []);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => { e.preventDefault(); const body = { ...form, price:Number(form.price), stock:Number(form.stock) }; editId ? await API.put(`/products/${editId}`, body) : await API.post('/products', body); setForm(blank); setEditId(null); load(); };
  const edit = p => { setEditId(p._id); setForm({ name:p.name, description:p.description, price:p.price, image:p.image, category:p.category?._id, stock:p.stock }); };
  const del = async id => { if (confirm('Delete product?')) { await API.delete(`/products/${id}`); load(); } };
  return <div><h2>Admin Product Management</h2><form className="admin-form" onSubmit={submit}><input name="name" value={form.name} onChange={change} placeholder="Product name" required /><input name="price" value={form.price} onChange={change} placeholder="Price" type="number" required /><input name="stock" value={form.stock} onChange={change} placeholder="Stock" type="number" required /><input name="image" value={form.image} onChange={change} placeholder="Image URL" required /><select name="category" value={form.category} onChange={change} required><option value="">Select Category</option>{categories.map(c=><option value={c._id} key={c._id}>{c.name}</option>)}</select><textarea name="description" value={form.description} onChange={change} placeholder="Description" required /><button>{editId ? 'Update' : 'Add'} Product</button></form><div>{products.map(p=><div className="admin-row" key={p._id}><span>{p.name} - Rs. {p.price}</span><button onClick={()=>edit(p)}>Edit</button><button onClick={()=>del(p._id)}>Delete</button></div>)}</div></div>;
}
