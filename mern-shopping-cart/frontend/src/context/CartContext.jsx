import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]); const [total, setTotal] = useState(0);
  const setCart = (data) => { setItems(data.items || []); setTotal(data.total || 0); };
  const fetchCart = async () => { if (!user) return setCart({items:[], total:0}); const { data } = await API.get('/cart'); setCart(data); };
  const addToCart = async (productId, quantity = 1) => { if (!user) throw new Error('Please login first'); const { data } = await API.post('/cart', { productId, quantity }); setCart(data); };
  const updateQty = async (productId, quantity) => { const { data } = await API.put(`/cart/${productId}`, { quantity }); setCart(data); };
  const removeItem = async (productId) => { const { data } = await API.delete(`/cart/${productId}`); setCart(data); };
  const clearCart = async () => { const { data } = await API.delete('/cart'); setCart(data); };
  useEffect(() => { fetchCart().catch(() => {}); }, [user]);
  return <CartContext.Provider value={{ items, total, addToCart, updateQty, removeItem, clearCart, fetchCart }}>{children}</CartContext.Provider>;
};
export const useCart = () => useContext(CartContext);
