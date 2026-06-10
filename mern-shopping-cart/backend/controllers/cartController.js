import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
const populateCart = (cart) => cart.populate('items.product', 'name price image stock');
const totalOf = (cart) => cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  await populateCart(cart);
  res.json({ items: cart.items, total: totalOf(cart) });
};
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) item.quantity += Number(quantity); else cart.items.push({ product: productId, quantity });
  await cart.save();
  await populateCart(cart);
  res.json({ items: cart.items, total: totalOf(cart) });
};
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = cart.items.find(i => i.product.toString() === req.params.productId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.quantity = Number(quantity);
  await cart.save();
  await populateCart(cart);
  res.json({ items: cart.items, total: totalOf(cart) });
};
export const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  await populateCart(cart);
  res.json({ items: cart.items, total: totalOf(cart) });
};
export const clearCart = async (req, res) => {
  const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { new: true });
  res.json({ items: cart?.items || [], total: 0 });
};
