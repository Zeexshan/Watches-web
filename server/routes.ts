import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import multer from "multer";
import { getProducts, addOrder, addUser, loginUser, getOrders, addProduct, updateOrderStatus } from "./db";

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.resolve(process.cwd(), "attached_assets");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpg, png, webp) are allowed"));
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const products = await getProducts();
      res.json(products);
    } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const isAdmin = req.body.adminEmail === "zixshankhan@gmail.com";
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const product = await addProduct(req.body);
      res.json({ success: true, product });
    } catch (error) {
      console.error("Product Error:", error);
      res.status(500).json({ message: "Failed to save product" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const { email } = req.query;
      const isAdmin = !email; // If no email, treat as admin request
      
      // Basic admin check for global orders
      if (isAdmin && req.headers["admin-auth"] !== "zixshankhan@gmail.com") {
        // In a real app, use proper session/token auth
        // res.status(403).json({ message: "Unauthorized" });
      }

      const orders = await getOrders(email as string);
      res.json(orders);
    } catch (error) {
      console.error("Orders Fetch Error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const success = await updateOrderStatus(req.params.id, status);
      res.json({ success });
    } catch (error) {
      console.error("Order Update Error:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }
      const url = `/attached_assets/${req.file.filename}`;
      res.json({ success: true, url });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const order = {
        ...req.body,
        payment_method: req.body.paymentMethod === 'cod' ? 'COD' : 'PREPAID',
        shipping_fee_paid: req.body.shipping_fee_paid || 'TRUE',
        product_amount_due: req.body.product_amount_due || 0,
      };
      await addOrder(order);
      res.json({ success: true });
    } catch (error) {
      console.error("Order Error:", error);
      res.status(500).json({ message: "Failed to save order" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      await addUser(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Failed to register" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const user = await loginUser(req.body);
      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
