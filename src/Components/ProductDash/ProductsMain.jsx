import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Package, Loader2 } from "lucide-react";
import ProductModal from "./ProductModal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../Services/ProductsApi";
import ProductCard from "./ProductCard";

const FILTERS = ["All", "Curtains", "Blinds"];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editing, setEditing] = useState(null);

  // Fetch products on mount.
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({ limit: 100 });
      setProducts(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    return products.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const matchesFilter = filter === "All" || cat === filter.toLowerCase();
      const matchesQuery = (p.name || "")
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [products, filter, query]);

  const openAdd = () => {
    setModalMode("add");
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setEditing(product);
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    if (modalMode === "edit") {
      const updated = await updateProduct(editing.slug, form);
      setProducts((list) =>
        list.map((p) => (p.slug === editing.slug ? updated : p)),
      );
    } else {
      const created = await createProduct(form);
      setProducts((list) => [created, ...list]);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.slug);
      setProducts((list) => list.filter((p) => p.slug !== product.slug));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8 p-6 sm:p-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-600">
              <Package className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Inventory
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Products
            </h1>
            <p className="mt-1 text-gray-500">
              Manage your curtains and blinds catalogue.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </header>

        {/* Search + filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  "rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100",
                ].join(" ")}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading
            products...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={load}
              className="mt-3 text-sm font-semibold text-red-700 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <ProductCard
                key={p.slug || p._id}
                product={p}
                onEdit={() => openEdit(p)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-gray-500">No products found.</p>
            <button
              onClick={openAdd}
              className="mt-3 text-sm font-semibold text-red-600 hover:underline"
            >
              Add your first product
            </button>
          </div>
        )}
      </div>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialData={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
