"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";

function ShopContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        if (searchQuery) {
          const filtered = data.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase()),
          );
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(data);
        }
      });
  }, [searchQuery]);

  const filterProducts = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  const categories = [
    "All",
    "Tech & Electronics",
    "Fashion & Lifestyle",
    "Home & Kitchen",
    "Automotive & Bikes",
  ];

  return (
    <div className="shop-container" style={{ padding: "60px 5%" }}>
      <header
        className="shop-filters"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Our Collections"}
        </h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <select
            value={selectedCategory}
            onChange={(e) => filterProducts(e.target.value)}
            style={{
              padding: "10px 15px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h3 style={{ color: "var(--text-gray)" }}>
            No items match your search.
          </h3>
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Searching through catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
