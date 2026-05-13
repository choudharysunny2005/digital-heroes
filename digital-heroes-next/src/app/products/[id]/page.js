"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useCart } from "../../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p._id === id);
        setProduct(found);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="p-24 text-center font-bold">
        Loading Digital Heroes Perfection...
      </div>
    );
  if (!product)
    return <div className="p-24 text-center font-bold">Product Not Found</div>;

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <div className="max-w-[1400px] mx-auto px-[5%] py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-[#fdfdfd] dark:bg-slate-900 rounded-3xl p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="relative w-full h-[500px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-20 h-20 rounded-xl border border-slate-200 dark:border-slate-800 p-2 bg-white dark:bg-slate-900"
              >
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} thumb ${i}`}
                  width={80}
                  height={80}
                  className={`w-full h-full object-contain ${i !== 1 ? "opacity-40" : "opacity-100"}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[var(--accent-color)] font-extrabold uppercase tracking-widest text-sm">
              {product.category}
            </span>
            <div className="flex gap-4">
              <button
                className="text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Add to Wishlist"
              >
                <Heart size={20} />
              </button>
              <button
                className="text-slate-400 hover:text-[var(--accent-color)] transition-colors"
                aria-label="Share Product"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-slate-900 dark:text-white">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-8">
            <div className="text-orange-400 flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "text-slate-300"
                  }
                />
              ))}
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              {product.rating}
            </span>
            <span className="text-slate-500 ml-1">
              ({product.reviews} Reviews)
            </span>
          </div>

          <div className="mb-10 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <div className="flex flex-col">
                <span className="text-lg text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="bg-[var(--accent-color)] text-white text-xs font-black px-2 py-1 rounded inline-block uppercase w-fit">
                  {discount}% OFF
                </span>
              </div>
            </div>
            <p className="text-emerald-600 font-bold mt-2 text-sm">
              Inclusive of all taxes
            </p>
          </div>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-10">
            Experience the pinnacle of{" "}
            <span className="font-bold">{product.category}</span> with the new{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {product.name}
            </span>
            . Engineered for high-performance and durability, this product
            represents the heritage of Digital Heroes craftsmanship. Designed to
            integrate seamlessly into your premium lifestyle.
          </p>

          <div className="flex gap-4 mb-12">
            <button
              onClick={() => addToCart(product)}
              className="cta-button flex-1 py-5 flex items-center justify-center gap-3 text-lg font-black tracking-wide shadow-xl shadow-orange-500/20 active:scale-95"
            >
              <ShoppingCart size={22} /> Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex flex-col items-center text-center">
              <Truck size={24} className="text-[var(--accent-color)] mb-2" />
              <div className="text-xs font-bold uppercase tracking-tighter opacity-80">
                Free Shipping
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw
                size={24}
                className="text-[var(--accent-color)] mb-2"
              />
              <div className="text-xs font-bold uppercase tracking-tighter opacity-80">
                7-Day Return
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck
                size={24}
                className="text-[var(--accent-color)] mb-2"
              />
              <div className="text-xs font-bold uppercase tracking-tighter opacity-80">
                Authentic
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
