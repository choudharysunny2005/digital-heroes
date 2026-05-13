"use client";
import { useState } from "react";
import {
  ShoppingBag,
  ChevronRight,
  CheckCircle,
  Store,
  Mail,
  Lock,
  User,
} from "lucide-react";
import Link from "next/link";

export default function RetailerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call /api/auth/register-retailer
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="retailer-success"
        style={{ padding: "100px 5%", textAlign: "center" }}
      >
        <div
          style={{
            background: "var(--primary-bg-alt)",
            padding: "60px",
            borderRadius: "20px",
            maxWidth: "600px",
            margin: "0 auto",
            border: "1px solid var(--accent-color)",
          }}
        >
          <CheckCircle
            size={80}
            color="var(--accent-color)"
            style={{ marginBottom: "20px" }}
          />
          <h2 style={{ fontSize: "2.5rem", marginBottom: "15px" }}>
            Application Submitted!
          </h2>
          <p
            style={{
              color: "var(--secondary-color)",
              fontSize: "1.2rem",
              marginBottom: "30px",
            }}
          >
            Thank you, {formData.name}. Our admin team is reviewing your shop
            application <strong>({formData.shopName})</strong>. We'll contact
            you within 24 hours.
          </p>
          <Link href="/" className="cta-button">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        minHeight: "85vh",
      }}
    >
      <div
        style={{
          padding: "80px 10%",
          background: "var(--secondary-color)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1
          style={{ fontSize: "3.5rem", marginBottom: "20px", fontWeight: 800 }}
        >
          Sell on Digital Heroes
        </h1>
        <p
          style={{
            fontSize: "1.3rem",
            opacity: 0.9,
            lineHeight: 1.6,
            marginBottom: "40px",
          }}
        >
          Join over 10,000 retail partners. List your products and reach
          millions of customers instantly across the globe.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div
              style={{
                padding: "15px",
                background: "rgba(255,107,0,0.2)",
                color: "var(--accent-color)",
                borderRadius: "12px",
              }}
            >
              <Store size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Verified Shop Status</h4>
              <p style={{ margin: 0, opacity: 0.7 }}>
                Gain trust with our exclusive 'Verified' badge.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div
              style={{
                padding: "15px",
                background: "rgba(255,107,0,0.2)",
                color: "var(--accent-color)",
                borderRadius: "12px",
              }}
            >
              <ShoppingBag size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Advanced Inventory</h4>
              <p style={{ margin: 0, opacity: 0.7 }}>
                Manage stock and pricing with real-time analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "80px 10%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2 style={{ textAlign: "left", marginBottom: "10px" }}>
          Create Retailer Account
        </h2>
        <p style={{ marginBottom: "40px", color: "var(--text-gray)" }}>
          Start selling today and grow your business.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div style={{ position: "relative" }}>
            <User
              size={18}
              style={{
                position: "absolute",
                left: "15px",
                top: "15px",
                color: "#999",
              }}
            />
            <input
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "15px 15px 15px 45px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Mail
              size={18}
              style={{
                position: "absolute",
                left: "15px",
                top: "15px",
                color: "#999",
              }}
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "15px 15px 15px 45px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Store
              size={18}
              style={{
                position: "absolute",
                left: "15px",
                top: "15px",
                color: "#999",
              }}
            />
            <input
              type="text"
              placeholder="Shop Name"
              required
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
              style={{
                width: "100%",
                padding: "15px 15px 15px 45px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Lock
              size={18}
              style={{
                position: "absolute",
                left: "15px",
                top: "15px",
                color: "#999",
              }}
            />
            <input
              type="password"
              placeholder="Create Password"
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: "15px 15px 15px 45px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <button
            type="submit"
            className="cta-button"
            style={{
              padding: "18px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              borderRadius: "10px",
            }}
          >
            Register as Retailer <ChevronRight size={18} />
          </button>
        </form>

        <p
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "var(--text-gray)",
          }}
        >
          Already a partner?{" "}
          <Link
            href="/login"
            style={{ color: "var(--accent-color)", fontWeight: 600 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
