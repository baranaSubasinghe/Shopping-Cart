import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
dotenv.config();
await connectDB();
await User.deleteMany(); await Category.deleteMany(); await Product.deleteMany();
const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: '123456', role: 'admin' });
const user = await User.create({ name: 'User', email: 'user@example.com', password: '123456', role: 'user' });
const cats = await Category.insertMany([{ name: 'Vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800' },{ name: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800' },{ name: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800' },{ name: 'Biscuits', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800' }]);
const c = Object.fromEntries(cats.map(x => [x.name, x._id]));
await Product.insertMany([
  { name: 'Carrot', description: 'Fresh orange carrots.', price: 250, image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800', category: c.Vegetables, stock: 50 },
  { name: 'Tomato', description: 'Fresh red tomatoes.', price: 180, image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800', category: c.Vegetables, stock: 40 },
  { name: 'Apple', description: 'Sweet red apples.', price: 120, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800', category: c.Fruits, stock: 80 },
  { name: 'Banana', description: 'Fresh bananas.', price: 70, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800', category: c.Fruits, stock: 100 },
  { name: 'Chocolate Cake', description: 'Soft chocolate cake.', price: 1500, image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800', category: c.Cakes, stock: 10 },
  { name: 'Butter Biscuits', description: 'Crispy butter biscuits.', price: 450, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800', category: c.Biscuits, stock: 25 }
]);
console.log('Seeded:', { admin: admin.email, user: user.email });
await mongoose.connection.close();
