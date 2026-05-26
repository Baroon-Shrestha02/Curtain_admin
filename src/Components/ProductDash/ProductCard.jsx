import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const BADGE_STYLES = {
  New: "bg-emerald-500 text-white",
  Bestseller: "bg-amber-500 text-white",
  Sale: "bg-red-600 text-white",
  Limited: "bg-violet-600 text-white",
};

const IMG_BG = {
  curtains: "bg-gray-900",
  blinds: "bg-amber-950",
};

export default function NewProductCard({ product, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false);

  const image = product.images?.[0]?.url;
  const showImage = image && !imgError;
  const isCurtain = product.category === "curtains";
  const discounted = product.discount > 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div
        className={`relative aspect-[4/3] overflow-hidden ${!showImage ? (isCurtain ? "bg-gray-900" : "bg-amber-950") : "bg-gray-100"}`}
      >
        {showImage ? (
          <img
            src={image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-black tracking-tighter text-white/90">
            {initials(product.name)}
          </div>
        )}

        {/* Category — top left */}
        <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm">
          {product.category}
        </span>

        {/* Badge — top right */}
        {product.badge && (
          <span
            className={`absolute right-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${BADGE_STYLES[product.badge] || "bg-gray-700 text-white"}`}
          >
            {product.badge}
          </span>
        )}

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="rounded-full border border-white/30 bg-white/90 px-4 py-1.5 text-xs font-bold text-gray-800">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute right-3 bottom-3 flex gap-1.5 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={() => onEdit?.(product)}
            aria-label="Edit"
            className="rounded-lg bg-white/95 p-2 text-gray-700 shadow backdrop-blur-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(product)}
            aria-label="Delete"
            className="rounded-lg bg-white/95 p-2 text-gray-700 shadow backdrop-blur-sm hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Name + subcategory */}
        <div>
          <p className="truncate text-xs text-gray-400 uppercase tracking-wide">
            {product.subcategory}
          </p>
          <p className="truncate font-bold text-gray-900 leading-snug">
            {product.name}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-gray-900">
            Rs. {product.price?.toLocaleString()}
          </span>
          {discounted && (
            <>
              <span className="text-sm text-gray-400 line-through">
                Rs. {product.originalPrice?.toLocaleString()}
              </span>
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
                -{product.discount}%
              </span>
            </>
          )}
        </div>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 6).map((c, i) => (
              <span
                key={i}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className="h-4 w-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
              />
            ))}
            {product.colors.length > 6 && (
              <span className="text-[11px] text-gray-400">
                +{product.colors.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Specs */}
        {product.specs?.length > 0 && (
          <div className="rounded-xl bg-gray-50 px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1">
            {product.specs.slice(0, 4).map((s, i) => (
              <div key={i} className="flex justify-between gap-1 text-[11px]">
                <span className="text-gray-400 truncate">{s.label}</span>
                <span className="font-semibold text-gray-700 truncate">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        {product.features?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600"
              >
                {f}
              </span>
            ))}
            {product.features.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-400">
                +{product.features.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onEdit?.(product)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            onClick={() => onDelete?.(product)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-red-100 py-2 text-xs font-bold text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
