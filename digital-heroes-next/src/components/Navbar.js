"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Moon, Sun } from "lucide-react";

import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link href="/">
          <h2 style={{ margin: 0, fontWeight: 800 }}>Digital Heroes</h2>
        </Link>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products, brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        <button
          onClick={() =>
            searchQuery.trim() && router.push(`/shop?q=${searchQuery}`)
          }
        >
          <Search size={20} />
        </button>
      </div>

      <nav className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={pathname === link.path ? "active" : ""}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div
        className="nav-icons"
        style={{ display: "flex", alignItems: "center", gap: "20px" }}
      >
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <Link
          href="/cart"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            position: "relative",
          }}
        >
          <div style={{ position: "relative" }}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "var(--accent-color)",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <span className="icon-text">Cart</span>
        </Link>
        <Link
          href="/login"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <User size={24} />
          <span className="icon-text">Login</span>
        </Link>
      </div>
    </header>
  );
}
