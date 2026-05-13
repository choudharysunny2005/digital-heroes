import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    let products = await Product.find();

    if (products.length === 0 || products.length < 10) {
      await Product.deleteMany({}); // Force refresh to update images
      const categories = [
        "Tech & Electronics",
        "Fashion & Lifestyle",
        "Home & Kitchen",
        "Automotive & Bikes",
      ];

      const itemTemplates = {
        "Tech & Electronics": [
          "Apple iPhone 15 Pro",
          "Samsung Galaxy S24 Ultra",
          "MacBook Pro M3 Max",
          "Sony PlayStation 5",
          "Nintendo Switch OLED",
          "Bose QuietComfort 45",
          "Sony WH-1000XM5",
          "Alienware Gaming PC",
          "LG C3 OLED TV",
          "Canon EOS R5 Mirrorless",
        ],
        "Fashion & Lifestyle": [
          "Nike Air Force 1",
          "Rolex Submariner Style Watch",
          "Levi's 511 Slim Jeans",
          "Premium Cashmere Hoodie",
          "Dior Sauvage Fragrance",
          "Gucci Leather Wallet",
          "Ray-Ban Aviator Glasses",
          "Adidas Ultraboost",
          "Prada Crossbody Bag",
          "Polo Ralph Lauren Shirt",
        ],
        "Home & Kitchen": [
          "Italian Leather Sectional",
          "Vitamix High-Speed Blender",
          "Keurig Single Serve Coffee",
          "Dyson V15 Detect Vacuum",
          "KitchenAid Stand Mixer",
          "Instant Pot Pro Plus",
          "Cast Iron Skillet Set",
          "Queen Size Memory Foam",
          "Nespresso Vertuo",
          "Samsung Smart Refrigerator",
        ],
        "Automotive & Bikes": [
          "Waterproof Luxury Car Cover",
          "ceramic Coating Pro Kit",
          "Brembo High Performance Brakes",
          "Michelin Pilot Sport 4S",
          "CEAT Premium Bike Tyre",
          "Bell Full-Face Riding Helmet",
          "Advanced Anti-Theft GPS",
          "Motul Full Synthetic Oil",
          "Portable Smart Air Pump",
          "Microfiber Detailing Towels",
        ],
      };

      const manualImageMap = {
        "Apple iPhone 15 Pro":
          "https://m.media-amazon.com/images/I/81SigNo9ZOL._SX679_.jpg",
        "Samsung Galaxy S24 Ultra":
          "https://m.media-amazon.com/images/I/71RVuS3q9ML._SX679_.jpg",
        "MacBook Pro M3 Max":
          "https://m.media-amazon.com/images/I/618mS-oXbfL._SX679_.jpg",
        "Sony PlayStation 5":
          "https://m.media-amazon.com/images/I/5105T6JF9VL._SX679_.jpg",
        "Bose QuietComfort 45":
          "https://m.media-amazon.com/images/I/51QeS0jkx-L._SX679_.jpg",
        "Sony WH-1000XM5":
          "https://m.media-amazon.com/images/I/51SKu69S7pL._SX679_.jpg",
        "Nintendo Switch OLED":
          "https://m.media-amazon.com/images/I/51Y7XF4E-FL._SX679_.jpg",
        "Nike Air Force 1":
          "https://m.media-amazon.com/images/I/7120G6A8SXL._SX679_.jpg",
        "Adidas Ultraboost":
          "https://m.media-amazon.com/images/I/715Qp9FjLdL._SX679_.jpg",
        "Dior Sauvage Fragrance":
          "https://m.media-amazon.com/images/I/61piz0L7F0L._SX679_.jpg",
        "Rolex Submariner Style Watch":
          "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
        "Dyson V15 Detect Vacuum":
          "https://m.media-amazon.com/images/I/61-9sI9-1uL._SX679_.jpg",
        "KitchenAid Stand Mixer":
          "https://m.media-amazon.com/images/I/71Y-sK7n9tL._SX679_.jpg",
        "Italian Leather Sectional":
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        "Keurig Single Serve Coffee":
          "https://m.media-amazon.com/images/I/61E9U5f-NGL._SX679_.jpg",
        "Samsung Smart Refrigerator":
          "https://m.media-amazon.com/images/I/718yP-zU3LL._SX679_.jpg",
        "Instant Pot Pro Plus":
          "https://m.media-amazon.com/images/I/71Wp6v0o8XL._SX679_.jpg",
        "Michelin Pilot Sport 4S":
          "https://m.media-amazon.com/images/I/71hOIsInDNL._SX679_.jpg",
        "CEAT Premium Bike Tyre":
          "https://m.media-amazon.com/images/I/61Tir-7B62L._SX679_.jpg",
        "Bell Full-Face Riding Helmet":
          "https://m.media-amazon.com/images/I/71tQYxP7KML._SX679_.jpg",
      };

      const fallbackProducts = [];
      categories.forEach((category) => {
        const templates = itemTemplates[category];

        templates.forEach((name, i) => {
          for (let v = 1; v <= 2; v++) {
            // 2 variants each (Total ~80 items)
            const price =
              category === "Tech & Electronics"
                ? Math.floor(Math.random() * 80000) + 20000
                : Math.floor(Math.random() * 15000) + 1000;

            const fullName = v === 1 ? name : `${name} (Edition ${v})`;

            // Priority: Manual Map -> Search API
            const finalImageUrl =
              manualImageMap[name] ||
              `https://loremflickr.com/800/800/${encodeURIComponent(name.replace(/ /g, ","))}?lock=${i + v}`;

            fallbackProducts.push({
              name: fullName,
              category: category,
              price: price,
              originalPrice: price + Math.floor(price * 0.25),
              imageUrl: finalImageUrl,
              rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
              reviews: Math.floor(Math.random() * 1000) + 50,
            });
          }
        });
      });

      await Product.insertMany(fallbackProducts);
      products = await Product.find();
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newProduct = new Product({
      ...body,
      rating: body.rating || 5, // Default for new products
      reviews: body.reviews || 0,
      status: body.status || "active",
    });
    await newProduct.save();
    const allProducts = await Product.find();
    return NextResponse.json(allProducts);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
