"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Laptop,
  Utensils,
  Car,
  Shirt,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headset,
} from "lucide-react";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 4)); // Display first 4 as 'Best Selling'
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Digital Heroes: Premium Redefined.
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Shop top-tier electronics, fashion, and lifestyle essentials with
            the assurance of curated quality and unbeatable value.
          </p>
          <Link
            href="/shop"
            className="cta-button scale-110 shadow-2xl shadow-orange-500/30"
          >
            Shop The Collection
          </Link>
        </div>
      </section>

      <section className="trust-badges grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 bg-slate-50 dark:bg-slate-900/50">
        <div className="badge flex items-center justify-center gap-3">
          <Truck size={24} className="text-[var(--accent-color)]" />
          <span className="font-bold text-sm tracking-tight">
            Free Global Shipping
          </span>
        </div>
        <div className="badge flex items-center justify-center gap-3">
          <RotateCcw size={24} className="text-[var(--accent-color)]" />
          <span className="font-bold text-sm tracking-tight">
            30-Day Returns
          </span>
        </div>
        <div className="badge flex items-center justify-center gap-3">
          <ShieldCheck size={24} className="text-[var(--accent-color)]" />
          <span className="font-bold text-sm tracking-tight">
            Encrypted Payments
          </span>
        </div>
        <div className="badge flex items-center justify-center gap-3">
          <Headset size={24} className="text-[var(--accent-color)]" />
          <span className="font-bold text-sm tracking-tight">
            24/7 Priority Support
          </span>
        </div>
      </section>

      <section className="categories py-20 px-[5%]">
        <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-tighter">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="category-card p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center transition-all hover:-translate-y-2 hover:border-[var(--accent-color)] cursor-pointer group shadow-sm">
            <Laptop
              size={40}
              className="mb-4 text-slate-800 dark:text-white group-hover:text-[var(--accent-color)] transition-colors"
            />
            <span className="font-black tracking-tight text-lg">
              Tech & Electronics
            </span>
          </div>
          <div className="category-card p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center transition-all hover:-translate-y-2 hover:border-[var(--accent-color)] cursor-pointer group shadow-sm">
            <Shirt
              size={40}
              className="mb-4 text-slate-800 dark:text-white group-hover:text-[var(--accent-color)] transition-colors"
            />
            <span className="font-black tracking-tight text-lg">
              Fashion & Style
            </span>
          </div>
          <div className="category-card p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center transition-all hover:-translate-y-2 hover:border-[var(--accent-color)] cursor-pointer group shadow-sm">
            <Utensils
              size={40}
              className="mb-4 text-slate-800 dark:text-white group-hover:text-[var(--accent-color)] transition-colors"
            />
            <span className="font-black tracking-tight text-lg">
              Home & Kitchen
            </span>
          </div>
          <div className="category-card p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center transition-all hover:-translate-y-2 hover:border-[var(--accent-color)] cursor-pointer group shadow-sm">
            <Car
              size={40}
              className="mb-4 text-slate-800 dark:text-white group-hover:text-[var(--accent-color)] transition-colors"
            />
            <span className="font-black tracking-tight text-lg">
              Auto & Bikes
            </span>
          </div>
        </div>
      </section>

      <section className="product-highlight mx-[5%] my-20 p-0 rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-slate-900 text-white min-h-[500px] shadow-2xl">
        <div className="relative w-full h-[300px] lg:h-full">
          <Image
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
            alt="Premium Headphones highlight"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-12 md:p-20 flex flex-col justify-center">
          <span className="bg-[var(--accent-color)] w-fit px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Discovery of the week
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-left leading-tight">
            Sonic Precision. <br />
            Pure Silence.
          </h2>
          <p className="text-lg opacity-70 mb-8 leading-relaxed max-w-lg">
            Experience uncompromised audio fidelity with industry-leading NC
            tech. 40-hour battery life meets handcrafted ergonomic comfort.
          </p>
          <div className="flex items-center gap-6 mb-10">
            <span className="text-4xl font-black text-[var(--accent-color)]">
              ₹15,999
            </span>
            <span className="text-xl opacity-40 line-through">₹24,999</span>
          </div>
          <Link href="/shop" className="cta-button w-fit px-10 py-4 font-black">
            Secure The Deal
          </Link>
        </div>
      </section>

      <section className="products-section py-20 px-[5%]">
        <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-tighter">
          Bestselling Essentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="newsletter py-32 px-[5%] bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
            Join The Inner Circle.
          </h2>
          <p className="text-lg opacity-60 mb-12 max-w-xl mx-auto">
            Receive early access to seasonal drops and exclusive priority
            pricing. No spam, purely perfection.
          </p>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto overflow-hidden rounded-2xl border border-white/20">
            <input
              type="email"
              placeholder="Email coordinates..."
              className="flex-1 px-8 py-5 bg-white/5 backdrop-blur-md outline-none text-white font-medium"
            />
            <button className="bg-white text-black font-black px-10 py-5 hover:bg-[var(--accent-color)] hover:text-white transition-all uppercase tracking-widest text-sm">
              Join Now
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,var(--accent-color),transparent_70%)]"></div>
      </section>
    </div>
  );
}
