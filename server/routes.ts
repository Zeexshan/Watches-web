import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import multer from "multer";
import { getProducts, addOrder, addUser, loginUser, getOrders, addProduct, updateOrderStatus, deleteProduct } from "./db";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for image uploads (buffer storage for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: any, file: any, cb: any) => {
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

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const isAdmin = req.query.adminEmail === "zixshankhan@gmail.com";
      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const success = await deleteProduct(parseInt(req.params.id));
      res.json({ success });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.post("/api/upload", upload.single("image"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      // Upload to Cloudinary using stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "circle-luxury/products",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({ success: false, error: "Cloudinary upload failed" });
          }
          res.json({ success: true, url: result?.secure_url });
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (error: any) {
      console.error("Upload Route Error:", error);
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
