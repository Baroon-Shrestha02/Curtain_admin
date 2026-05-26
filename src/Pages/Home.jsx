import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import HomeMain from "../Components/HomeDash/HomeMain";
import { getProducts } from "../Services/ProductsApi";
import { getGallery } from "../Services/GalleryApi";

function formatPrice(value) {
  if (value == null) return "";
  return `Rs. ${Number(value).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, galleryRes] = await Promise.all([
        getProducts({ limit: 100, sort: "createdAt", order: "desc" }),
        getGallery(),
      ]);
      setProducts(productsRes.data || []);
      setGallery(galleryRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const subCategories = new Set(
      products.map((p) => p.subcategory).filter(Boolean),
    ).size;
    return {
      products: products.length,
      subCategories,
      gallery: gallery.length,
    };
  }, [products, gallery]);

  const recent = useMemo(
    () =>
      products.slice(0, 4).map((p) => ({
        id: p._id || p.slug,
        name: p.name,
        category:
          (p.category || "").charAt(0).toUpperCase() +
          (p.category || "").slice(1),
        price: formatPrice(p.price ?? p.originalPrice),
        addedOn: formatDate(p.createdAt),
        image: p.images?.[0]?.url || p.images?.[0] || "",
      })),
    [products],
  );

  const saleData = useMemo(() => {
    const total = products.length || 1;
    const curtains = products.filter(
      (p) => (p.category || "").toLowerCase() === "curtains",
    ).length;
    const blinds = products.filter(
      (p) => (p.category || "").toLowerCase() === "blinds",
    ).length;
    return [
      {
        label: "Curtains",
        value: Math.round((curtains / total) * 100),
        color: "#3b82f6",
      },
      {
        label: "Blinds",
        value: Math.round((blinds / total) * 100),
        color: "#f59e0b",
      },
    ];
  }, [products]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-8 py-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={load}
            className="mt-3 text-sm font-semibold text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return <HomeMain products={recent} stats={stats} saleData={saleData} />;
}
