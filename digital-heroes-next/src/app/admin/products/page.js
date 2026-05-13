"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  Package,
  Check,
  AlertCircle,
} from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(null); // ID of product being edited
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Tech & Electronics",
    price: "",
    originalPrice: "",
    imageUrl: "",
    inventory: 100,
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleEdit = (product) => {
    setNewProduct(product);
    setEditMode(product._id);
    setShowAddForm(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const res = await fetch(`/api/products/${editMode}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        });
        const updated = await res.json();
        setProducts(products.map((p) => (p._id === editMode ? updated : p)));
        alert(`Product "${newProduct.name}" updated in database!`);
      } else {
        const res = await fetch("/api/products", {
          // Note: I should add POST to /api/products too
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        });
        const saved = await res.json();
        if (Array.isArray(saved)) {
          // If it returned all products
          setProducts(saved);
        } else {
          setProducts([...products, saved]);
        }
        alert(`${newProduct.name} has been added to catalog!`);
      }
      setShowAddForm(false);
      setEditMode(null);
    } catch (err) {
      console.error(err);
      alert("Error updating database");
    }
  };

  const deleteProduct = async (id) => {
    if (confirm("Permanently delete this product from database?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7f9" }}>
      {/* Sidebar Mockup */}
      <div
        style={{
          width: "280px",
          background: "var(--secondary-color)",
          color: "white",
          padding: "40px 20px",
        }}
      >
        <h2 style={{ marginBottom: "40px", color: "var(--accent-color)" }}>
          Admin Hub
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div
            style={{
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Package size={20} /> Inventory Management
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
            <AlertCircle size={20} /> Pending Approvals
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div style={{ flex: 1, padding: "40px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "var(--secondary-color)",
              fontSize: "2rem",
            }}
          >
            Product Inventory
          </h2>
          <button
            onClick={() => {
              setNewProduct({
                name: "",
                category: "Tech & Electronics",
                price: "",
                originalPrice: "",
                imageUrl: "",
                inventory: 100,
              });
              setEditMode(null);
              setShowAddForm(true);
            }}
            className="cta-button"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Plus size={20} /> Add New Product
          </button>
        </header>

        {showAddForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1001,
            }}
          >
            <form
              onSubmit={handleAddProduct}
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "15px",
                width: "500px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {editMode ? "Edit Product" : "Add New Item"}
                </h3>
                <X
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowAddForm(false)}
                />
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 15 Pro"
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="49999"
                    required
                    style={{
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="59999"
                    required
                    style={{
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                    value={newProduct.originalPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        originalPrice: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Image URL
                </label>
                <div style={{ position: "relative" }}>
                  <ImageIcon
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
                    placeholder="https://..."
                    required
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 40px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cta-button"
                style={{
                  padding: "15px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Save size={20} /> Save Product
              </button>
            </form>
          </div>
        )}

        {/* Inventory List */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            border: "1px solid #eee",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead
              style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}
            >
              <tr>
                <th style={{ padding: "20px" }}>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td
                    style={{
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <img
                      src={product.imageUrl}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <span style={{ fontWeight: 600 }}>{product.name}</span>
                  </td>
                  <td>{product.category}</td>
                  <td>₹{product.price?.toLocaleString()}</td>
                  <td>{product.inventory || 100}</td>
                  <td>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background:
                          product.status === "active" ? "#e6fffa" : "#fff5f5",
                        color:
                          product.status === "active" ? "#2c7a7b" : "#c53030",
                      }}
                    >
                      {product.status || "active"}
                    </span>
                  </td>
                  <td
                    style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                  >
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4a5568",
                        cursor: "pointer",
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e53e3e",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
