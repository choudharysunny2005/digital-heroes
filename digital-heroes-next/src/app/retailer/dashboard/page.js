"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Package,
  DollarSign,
  Users,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function RetailerDashboard() {
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch products with retailerId === currentUserId
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setMyProducts(data.slice(0, 5))); // Mocking first 5 as 'retailer owned'
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7f9" }}>
      <div
        style={{
          width: "280px",
          background: "var(--secondary-color)",
          color: "white",
          padding: "40px 20px",
        }}
      >
        <h2 style={{ marginBottom: "40px", color: "var(--accent-color)" }}>
          Retailer Studio
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div
            style={{
              padding: "15px",
              background: "rgba(255,107,0,0.1)",
              color: "var(--accent-color)",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <TrendingUp size={20} /> Performance
          </div>
          <div
            style={{
              padding: "15px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: 0.6,
            }}
          >
            <Package size={20} /> My Listings
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Welcome Back, Retailer</h2>
            <p style={{ color: "var(--text-gray)" }}>
              Here's what's happening with your shop today.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="cta-button"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Plus size={20} /> Create Listing
          </Link>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {[
            {
              label: "Total Sales",
              value: "₹1,24,500",
              icon: <DollarSign size={24} />,
              color: "#48bb78",
            },
            {
              label: "Active Listings",
              value: "24",
              icon: <Package size={24} />,
              color: "#4299e1",
            },
            {
              label: "Total Customers",
              value: "842",
              icon: <Users size={24} />,
              color: "#9f7aea",
            },
            {
              label: "Pending Orders",
              value: "5",
              icon: <TrendingUp size={24} />,
              color: "var(--accent-color)",
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-gray)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </span>
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <h3 style={{ margin: 0, fontSize: "1.5rem" }}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "30px",
            border: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h3 style={{ margin: 0 }}>Recent Products</h3>
            <Link
              href="#"
              style={{
                color: "var(--accent-color)",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              View All Items <ChevronRight size={16} />
            </Link>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {myProducts.map((p) => (
              <div
                key={p._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  border: "1px solid #f8f9fa",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "15px", alignItems: "center" }}
                >
                  <img
                    src={p.imageUrl}
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "6px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div
                      style={{ fontSize: "0.8rem", color: "var(--text-gray)" }}
                    >
                      {p.category}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>
                    ₹{p.price.toLocaleString()}
                  </div>
                  <div style={{ color: "#48bb78", fontSize: "0.8rem" }}>
                    Stock: {p.inventory || 100}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
