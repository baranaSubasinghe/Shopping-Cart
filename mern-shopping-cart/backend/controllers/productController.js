import Product from '../models/Product.js';
export const getProducts = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const products = await Product.find(filter).populate('category', 'name').sort('-createdAt');
  res.json(products);
};
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};
export const createProduct = async (req, res) => res.status(201).json(await Product.create(req.body));
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};
