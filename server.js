const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Security: Restrict Admin Page to Local PC Only
const blockRemoteAdmin = (req, res, next) => {
  const adminRoutes = ['/admin.html', '/admin.js'];
  if (adminRoutes.some(route => req.path === route || req.path.startsWith(route))) {
    const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    if (!isLocal) {
      return res.status(403).send(`
        <div style="text-align: center; margin-top: 100px; font-family: sans-serif;">
          <h1 style="color: #e53e3e;">403 Forbidden - Access Denied</h1>
          <p>For security reasons, the Admin Dashboard is restricted and can only be accessed locally from the host computer.</p>
        </div>
      `);
    }
  }
  next();
};
app.use(blockRemoteAdmin);

app.use(express.static(__dirname));

// MongoDB Connection (Update URI if needed)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/digital_heroes_shop";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

const Product = require("./models/Product");

// API Endpoint to get products
app.get("/api/products", async (req, res) => {
  try {
    let products = [];

    // Attempt to fetch from DB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        // Admin can view everything, users only see active/approved items
        const filter =
          req.query.includePending === "true"
            ? {}
            : { isApproved: { $ne: false } };
        products = await Product.find(filter);
      } catch (dbErr) {
        console.error("DB Fetch Error:", dbErr);
      }
    }

    // Fallback realistic data to populate the Best-Selling section
    if (products.length === 0) {
      const categories = [
        "Tech & Electronics",
        "Fashion & Lifestyle",
        "Home & Kitchen",
        "Automotive & Bikes",
      ];

      const itemTemplates = {
        "Tech & Electronics": [
          "Apple iPhone 15",
          "Samsung Galaxy S24",
          "Oppo Reno 11",
          "Vivo X100",
          "Tecno Phantom V",
          "Redmi Note 13",
          "Realme 12 Pro",
          "Apple MacBook Pro M3",
          "Apple MacBook Air",
          "Dell XPS 15",
          "HP Spectre",
          "Lenovo ThinkPad",
          "Asus ROG Laptop",
          "Sony PlayStation 5",
          "Nintendo Switch OLED",
          "Microsoft Xbox Series X",
          "Samsung 4K Smart TV",
          "LG OLED TV",
          "Bose QuietComfort Headphones",
          "Sony WH-1000XM5",
        ],
        "Home & Kitchen": [
          "Premium Leather Sofa",
          "Solid Wood Dining Table",
          "King Size Bed Frame",
          "Kitchen Organizer Rack",
          "Non-stick Frying Pan Set",
          "Chef's Knife Set",
          "Electric Pressure Cooker",
          "Silicone Cooking Utensils",
          "Air Fryer 5L",
          "Microwave Oven",
          "Cast Iron Skillet",
          "Memory Foam Mattress",
          "Wooden Bookshelf",
          "Coffee Espresso Machine",
          "Robot Vacuum Cleaner",
          "Blender/Mixer Grinder",
        ],
        "Automotive & Bikes": [
          "Waterproof Car Cover",
          "Car Scratch Remover Spray",
          "Dashboard Polish Spray",
          "MRF Tubeless Car Tyre",
          "Michelin Pilot Sport Tire",
          "CEAT Bike Tyre",
          "Riding Helmet",
          "Bike LED Tail Light",
          "Anti-Theft Bike Lock",
          "Bike Chain Lube",
          "Mobile Phone Mount for Bike",
          "Car Jump Starter Powerbank",
          "Portable Tyre Inflator Air Pump",
          "Microfiber Car Cleaning Cloth",
        ],
        "Fashion & Lifestyle": [
          "Men's Cotton Polo Shirt",
          "Women's Floral Summer Dress",
          "Slim Fit Denim Jeans",
          "Running Sneakers",
          "Premium Leather Jacket",
          "Winter Warm Hoodie",
          "Polarized Aviator Sunglasses",
          "Men's Digital Watch",
          "Office Trousers",
          "Designer Crossbody Handbag",
          "Classic Plain T-Shirt",
          "Formal Leather Belt",
          "Winter Beanie Hat",
          "Sports Activewear Set",
        ],
      };

      const fallbackProducts = [];

      categories.forEach((category) => {
        const templates = itemTemplates[category] || [
          `${category} Premium Item`,
        ];
        // Increased to 60 products per category to add more products overall (240 total)
        for (let i = 1; i <= 60; i++) {
          const baseName = templates[i % templates.length];
          const variant = Math.floor(Math.random() * 900) + 100; // e.g. Model 452

          let price = Math.floor(Math.random() * 49500) + 500;
          // Make tech items generally more expensive
          if (category === "Tech & Electronics") {
            price = Math.floor(Math.random() * 90000) + 15000;
          }

          const originalPrice =
            price + Math.floor(price * (Math.random() * 0.4 + 0.1));

          fallbackProducts.push({
            _id: `fallback_${category.replace(/[^a-z]/gi, "")}_${i}_${variant}`,
            name: `${baseName} (Variant ${variant})`,
            category: category,
            price: price,
            originalPrice: originalPrice,
            imageUrl: `https://picsum.photos/seed/${category.length * i + variant}/600/600`,
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
            reviews: Math.floor(Math.random() * 500) + 10,
          });
        }
      });

      // "attach them with database" - Attach and save these randomly generated items to the actual database
      if (mongoose.connection.readyState === 1) {
        try {
          await Product.insertMany(fallbackProducts);
          console.log("Successfully seeded database with 240 items.");

          // Fetch the real inserted documents so they have correct _ids
          products = await Product.find();
          return res.json(products);
        } catch (seedErr) {
          console.error("Failed to seed database:", seedErr);
        }
      }

      // Return the unseeded data if MongoDB isn't running
      return res.json(fallbackProducts);
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API Endpoint to add a product
app.post("/api/products", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "Database not connected" });
    }
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoint to update a product
app.put("/api/products/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "Database not connected" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoint to delete a product
app.delete("/api/products/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "Database not connected" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API Endpoint to get orders
app.get("/api/orders", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const Order = require("./models/Order");
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API Endpoint to submit an order
app.post("/api/orders", async (req, res) => {
  try {
    const { items, totalAmount, customer, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let newOrder = {
      items,
      totalAmount,
      customer,
      paymentMethod: paymentMethod || "Credit Card",
    };
    if (mongoose.connection.readyState === 1) {
      const Order = require("./models/Order");
      const order = new Order(newOrder);
      await order.save();
      return res
        .status(201)
        .json({ message: "Order placed successfully", order });
    } else {
      // Emulate success if MongoDB offline
      newOrder._id = "guest_" + Date.now();
      newOrder.createdAt = new Date();
      newOrder.status = "Processing";
      return res
        .status(201)
        .json({ message: "Order placed off-grid", order: newOrder });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API Endpoint to update order status
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const Order = require("./models/Order");
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      return res.json(updatedOrder);
    }
    res.status(500).json({ message: "Database offline" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
