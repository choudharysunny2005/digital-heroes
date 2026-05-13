"use client";
import { Star, StarHalf, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  if (!product) return null;

  const { addToCart } = useCart();
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card group relative flex flex-col h-full bg-white dark:bg-slate-800 transition-all duration-300">
      <Link
        href={`/products/${product._id}`}
        className="flex-grow flex flex-col no-underline"
      >
        <div className="relative w-full h-[250px] bg-[#fdfdfd] dark:bg-slate-900 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="product-img object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="product-info p-5 flex-grow">
          <div className="text-[0.8rem] text-[var(--accent-color)] font-extrabold uppercase mb-1 tracking-wider">
            {product.category || product.name.split(" ")[0]}
          </div>
          <h3 className="product-title text-black dark:text-white line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 my-2 text-[var(--accent-color)]">
            {[...Array(5)].map((_, i) => {
              const ratingVal = i + 1;
              if (product.rating >= ratingVal)
                return <Star key={i} size={14} fill="currentColor" />;
              if (product.rating >= ratingVal - 0.5)
                return <StarHalf key={i} size={14} fill="currentColor" />;
              return <Star key={i} size={14} className="text-slate-300" />;
            })}
            <span className="text-[var(--text-gray)] text-sm ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <div className="price-container flex items-center gap-3 my-4">
            <span className="current-price text-xl font-extrabold text-[var(--accent-color)]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="old-price line-through text-[var(--text-gray)] text-sm">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
            <span className="discount-badge text-xs font-bold px-2 py-1 bg-orange-50 dark:bg-orange-950/20 text-[var(--accent-color)] rounded">
              {discount}% OFF
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5 pt-0 mt-auto">
        <button
          onClick={handleAdd}
          className="cta-button w-full flex items-center justify-center gap-2 py-3 font-bold transition-all"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
