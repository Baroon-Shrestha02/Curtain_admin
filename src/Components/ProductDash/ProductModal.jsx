import { useEffect, useRef, useState } from "react";
import { X, Loader2, UploadCloud, Plus, Trash2, Check } from "lucide-react";
import { getSubcategoriesByCategory } from "../../Services/ProductsApi";

const EMPTY = {
  name: "",
  category: "curtains",
  subcategory: "",
  originalPrice: "",
  discount: "",
  description: "",
  badge: "",
  sale: false,
  inStock: true,
  images: [],
  specs: [{ label: "", value: "" }],
  features: [""],
  colors: [],
};

export default function ProductModal({
  open,
  mode = "add",
  initialData,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [previews, setPreviews] = useState([]);

  // Subcategory combobox state
  const [allSubs, setAllSubs] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subQuery, setSubQuery] = useState(""); // what's typed in the box
  const [subOpen, setSubOpen] = useState(false); // dropdown visibility
  const subBoxRef = useRef(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        category: (initialData.category || "curtains").toLowerCase(),
        subcategory: initialData.subcategory || "",
        originalPrice: initialData.originalPrice ?? "",
        discount: initialData.discount ?? "",
        description: initialData.description || "",
        badge: initialData.badge || "",
        sale: initialData.sale ?? false,
        inStock: initialData.inStock ?? true,
        images: [],
        specs: initialData.specs || [],
        features: initialData.features || [],
        colors: initialData.colors || [],
      });
      setPreviews((initialData.images || []).map((im) => im.url || im));
      setSubQuery(initialData.subcategory || "");
    } else {
      setForm(EMPTY);
      setPreviews([]);
      setSubQuery("");
    }
    setErr(null);
    setSaving(false);
    setSubOpen(false);
  }, [open, mode, initialData]);

  // Fetch ALL subcategories once when the modal opens.
  useEffect(() => {
    if (!open) return;
    let active = true;
    setSubLoading(true);
    getSubcategoriesByCategory()
      .then((list) => active && setAllSubs(Array.isArray(list) ? list : []))
      .catch(() => active && setAllSubs([]))
      .finally(() => active && setSubLoading(false));
    return () => {
      active = false;
    };
  }, [open]);

  // Close dropdown on outside click.
  useEffect(() => {
    if (!subOpen) return;
    const onClick = (e) => {
      if (subBoxRef.current && !subBoxRef.current.contains(e.target)) {
        setSubOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [subOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // ── Subcategory combobox helpers ──
  const q = subQuery.trim().toLowerCase();
  const filteredSubs = q
    ? allSubs.filter((s) => s.toLowerCase().includes(q))
    : allSubs;
  const exactMatch = allSubs.some((s) => s.toLowerCase() === q);
  const canAddNew = q.length > 0 && !exactMatch;

  const pickSub = (val) => {
    setForm((f) => ({ ...f, subcategory: val }));
    setSubQuery(val);
    setSubOpen(false);
  };

  const onSubInput = (e) => {
    const val = e.target.value;
    setSubQuery(val);
    setForm((f) => ({ ...f, subcategory: val })); // typed value IS the value
    setSubOpen(true);
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/"),
    );
    setForm((f) => ({ ...f, images: [...f.images, ...files] }));
    setPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  // ── Specs ──
  const addSpec = () =>
    setForm((f) => ({ ...f, specs: [...f.specs, { label: "", value: "" }] }));
  const removeSpec = (i) =>
    setForm((f) => ({ ...f, specs: f.specs.filter((_, j) => j !== i) }));
  const changeSpec = (i, key, val) =>
    setForm((f) => ({
      ...f,
      specs: f.specs.map((s, j) => (j === i ? { ...s, [key]: val } : s)),
    }));

  // ── Features ──
  const addFeature = () =>
    setForm((f) => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (i) =>
    setForm((f) => ({ ...f, features: f.features.filter((_, j) => j !== i) }));
  const changeFeature = (i, val) =>
    setForm((f) => ({
      ...f,
      features: f.features.map((ft, j) => (j === i ? val : ft)),
    }));

  // ── Colors ──
  const addColor = () =>
    setForm((f) => ({
      ...f,
      colors: [...f.colors, { name: "", hex: "#000000" }],
    }));
  const removeColor = (i) =>
    setForm((f) => ({ ...f, colors: f.colors.filter((_, j) => j !== i) }));
  const changeColor = (i, key, val) =>
    setForm((f) => ({
      ...f,
      colors: f.colors.map((c, j) => (j === i ? { ...c, [key]: val } : c)),
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      await onSave?.({ ...form, subcategory: form.subcategory.trim() });
      onClose?.();
    } catch (e2) {
      setErr(e2.response?.data?.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500";

  const sectionTitle = "mb-2 text-sm font-semibold text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "edit" ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 px-6 py-5">
          {err && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {err}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={change}
              placeholder="e.g. Blackout Velvet Curtain"
              required
              className={field}
            />
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={change}
                className={field}
              >
                <option value="curtains">Curtains</option>
                <option value="blinds">Blinds</option>
              </select>
            </div>

            {/* Subcategory searchable combobox */}
            <div ref={subBoxRef} className="relative">
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Subcategory
                {subLoading && (
                  <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                )}
              </label>
              <input
                name="subcategory"
                value={subQuery}
                onChange={onSubInput}
                onFocus={() => setSubOpen(true)}
                placeholder="Search or type new…"
                required
                autoComplete="off"
                className={field}
              />

              {subOpen && (filteredSubs.length > 0 || canAddNew) && (
                <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {filteredSubs.map((s) => {
                    const selected = s === form.subcategory;
                    return (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => pickSub(s)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {s}
                          {selected && (
                            <Check className="h-4 w-4 text-red-600" />
                          )}
                        </button>
                      </li>
                    );
                  })}

                  {canAddNew && (
                    <li className="border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => pickSub(subQuery.trim())}
                        className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <Plus className="h-4 w-4" /> Add “{subQuery.trim()}”
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Price + Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Original Price (Rs.)
              </label>
              <input
                name="originalPrice"
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={change}
                placeholder="4500"
                required
                className={field}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                name="discount"
                type="number"
                min="0"
                max="100"
                value={form.discount}
                onChange={change}
                placeholder="0"
                className={field}
              />
            </div>
          </div>

          {/* Calculated price preview */}
          {form.originalPrice && (
            <p className="text-xs text-gray-500">
              Final price:{" "}
              <span className="font-semibold text-gray-800">
                Rs.{" "}
                {(
                  form.originalPrice -
                  (form.originalPrice * (form.discount || 0)) / 100
                ).toFixed(0)}
              </span>
            </p>
          )}

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows={3}
              placeholder="Short description..."
              required
              className={field}
            />
          </div>

          {/* Badge + sale + inStock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Badge
              </label>
              <select
                name="badge"
                value={form.badge}
                onChange={change}
                className={field}
              >
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Sale">Sale</option>
                <option value="Limited">Limited</option>
              </select>
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="sale"
                  checked={form.sale}
                  onChange={change}
                  className="h-4 w-4 rounded accent-red-600"
                />
                On Sale
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={form.inStock}
                  onChange={change}
                  className="h-4 w-4 rounded accent-red-600"
                />
                In Stock
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Images
            </label>
            <div
              onClick={() => inputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-6 py-6 text-center hover:border-gray-300 hover:bg-gray-50"
            >
              <UploadCloud className="h-6 w-6 text-gray-400" />
              <p className="mt-1 text-sm font-medium text-gray-700">
                Click to upload images
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {mode === "edit" && (
              <p className="mt-2 text-xs text-gray-400">
                Uploading new images replaces the existing ones.
              </p>
            )}
          </div>

          {/* Specs */}
          <div>
            <p className={sectionTitle}>Specs</p>
            <div className="space-y-2">
              {form.specs.length > 0 && (
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-1">
                  <span className="text-xs text-gray-400 px-1">Label</span>
                  <span className="text-xs text-gray-400 px-1">Value</span>
                  <span />
                </div>
              )}
              {form.specs.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                >
                  <input
                    value={s.label}
                    onChange={(e) => changeSpec(i, "label", e.target.value)}
                    placeholder="e.g. Width"
                    className={field}
                  />
                  <input
                    value={s.value}
                    onChange={(e) => changeSpec(i, "value", e.target.value)}
                    placeholder="e.g. 120cm"
                    className={field}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSpec}
              className="mt-2 flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl"
            >
              <Plus className="h-4 w-4" /> Add Spec
            </button>
          </div>

          {/* Features */}
          <div>
            <p className={sectionTitle}>Features</p>
            <div className="space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={f}
                    onChange={(e) => changeFeature(i, e.target.value)}
                    placeholder="e.g. Blackout"
                    className={field}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl"
            >
              <Plus className="h-4 w-4" /> Add Feature
            </button>
          </div>

          {/* Colors */}
          <div>
            <p className={sectionTitle}>Colors</p>
            <div className="space-y-2">
              {form.colors.map((c, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_auto] gap-2 items-center"
                >
                  <input
                    value={c.name}
                    onChange={(e) => changeColor(i, "name", e.target.value)}
                    placeholder="e.g. Olive"
                    className={field}
                  />
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => changeColor(i, "hex", e.target.value)}
                    className="h-9 w-10 cursor-pointer rounded-lg border border-gray-200 p-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addColor}
              className="mt-2 flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl"
            >
              <Plus className="h-4 w-4" /> Add Color
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
