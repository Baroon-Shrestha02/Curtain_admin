import React, { useState } from "react";
import { Package, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * "Recently Added Products" — grid of product cards with images.
 *
 * Props:
 *  - products: array of { id, name, category, price, addedOn, image }
 *  - onViewAll: optional click handler
 */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Blackout Velvet Curtain",
    category: "Living Room",
    price: "Rs. 4,500",
    addedOn: "May 25, 2026",
    image:
      "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600&q=80",
  },
  {
    id: 2,
    name: "Sheer Linen Drape",
    category: "Bedroom",
    price: "Rs. 2,800",
    addedOn: "May 24, 2026",
    image:
      "https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600&q=80",
  },
  {
    id: 3,
    name: "Roman Blind - Beige",
    category: "Office",
    price: "Rs. 3,200",
    addedOn: "May 23, 2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
  },
  {
    id: 4,
    name: "Floral Cotton Panel",
    category: "Kids Room",
    price: "Rs. 1,950",
    addedOn: "May 22, 2026",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
  },
];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const showImage = product.image && !imgError;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image / fallback */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-900 text-2xl font-bold text-white">
            {initials(product.name)}
          </div>
        )}

        {/* Price chip */}
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-gray-900 shadow-sm backdrop-blur">
          {product.price}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="truncate font-semibold text-gray-900">{product.name}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
          <span className="truncate">{product.category}</span>
        </p>
        <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-gray-400">
          Added: {product.addedOn}
        </p>
      </div>
    </div>
  );
}

export default function RecentProducts({
  products = DEFAULT_PRODUCTS,
  onViewAll,
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600">
            <Package className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              New Inventory
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Recently Added Products
          </h2>
        </div>

        <Link
          to="/products"
          className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          View All <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
