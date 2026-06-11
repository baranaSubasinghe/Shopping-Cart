import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import connectDB from "./config/db.js";
import passport, { setupPassport } from "./config/passport.js";import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app = express();

connectDB();
setupPassport();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "shoppingcartsecret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Shopping Cart API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);


app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});