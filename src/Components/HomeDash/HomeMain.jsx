import React from "react";
import RecentProducts from "./RecentProducts";
import HomeCards from "./HomeCards";
import ProductCount from "./ProductCount";

/**
 * Dashboard home.
 *
 * Props:
 *  - products: array forwarded to RecentProducts
 *  - stats: { products, subCategories, gallery } (counts) -> HomeCards
 *  - saleData: [{ label, value, color }] -> ProductSaleChart
 */
export default function HomeMain({ products, stats = {}, saleData }) {
  const { products: productCount = 0, subCategories = 0, gallery = 0 } = stats;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8 p-6 sm:p-8">
        {/* Heading */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              System <span className="italic text-red-600">Overview</span>
            </h1>
            <p className="mt-2 text-base text-gray-500 sm:text-lg">
              Admin Dashboard — monitoring platform inventory.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-bold tracking-wide text-gray-700">
              LIVE
            </span>
          </div>
        </header>

        {/* Donut stat cards */}
        <HomeCards
          products={productCount}
          subCategories={subCategories}
          gallery={gallery}
        />

        {/* Bottom row: recent products (left) + sale chart (right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentProducts products={products} />
          </div>
          <div className="lg:col-span-1">
            <ProductCount data={saleData} />
          </div>
        </div>
      </div>
    </div>
  );
}
