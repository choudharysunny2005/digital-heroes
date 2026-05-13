"use client";
import { useCart } from "../../context/CartContext";
import { Trash2, ShoppingBag, Lock, Mail, User, MapPin } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div
        className="cart-container"
        style={{ padding: "100px 5%", textAlign: "center" }}
      >
        <div
          style={{
            background: "var(--primary-bg-alt)",
            padding: "60px",
            borderRadius: "15px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <ShoppingBag
            size={80}
            style={{ color: "var(--text-gray)", marginBottom: "20px" }}
          />
          <h2>Your cart is currently empty</h2>
          <p style={{ margin: "20px 0 30px 0", color: "var(--text-gray)" }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/shop" className="cta-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + tax;

  return (
    <div className="cart-container" style={{ padding: "60px 5%" }}>
      <h2 style={{ textAlign: "left", marginBottom: "40px" }}>Shopping Cart</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "40px",
          alignItems: "start",
        }}
      >
        <div
          className="cart-items"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                gap: "20px",
                background: "var(--primary-bg-alt)",
                padding: "20px",
                borderRadius: "12px",
                alignItems: "center",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <p
                  style={{
                    color: "var(--accent-color)",
                    fontWeight: 700,
                    marginTop: "5px",
                  }}
                >
                  ₹{item.price.toLocaleString()}
                </p>
                <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                  Quantity: {item.quantity}
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff4d4f",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>

        <div
          className="cart-summary"
          style={{
            background: "var(--primary-bg-alt)",
            padding: "30px",
            borderRadius: "15px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "15px",
            }}
          >
            <span>Estimated Tax (18%)</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 800,
              fontSize: "1.4rem",
              marginBottom: "30px",
            }}
          >
            <span>Total</span>
            <span style={{ color: "var(--accent-color)" }}>
              ₹{total.toLocaleString()}
            </span>
          </div>

          <div style={{ borderTop: "1px solid #ddd", paddingTop: "25px" }}>
            <h4 style={{ marginBottom: "20px" }}>Shipping Details</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div style={{ position: "relative" }}>
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "15px",
                    color: "#999",
                  }}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "15px",
                    color: "#999",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <MapPin
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "15px",
                    color: "#999",
                  }}
                />
                <textarea
                  placeholder="Delivery Address"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                ></textarea>
              </div>
              <button
                className="cta-button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "18px",
                }}
              >
                <Lock size={18} /> Place Order Securely
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
