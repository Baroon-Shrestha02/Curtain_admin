import React, { useEffect, useRef, useState } from "react";
import {
  X,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  Plus,
  Check,
} from "lucide-react";
import { getGalleryCategories } from "../../Services/GalleryApi";

/**
 * Upload-image modal (file picker + preview).
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onUpload: (items) => void|Promise   // items: [{ file, previewUrl, name, category }]
 */

export default function GalleryModal({ open, onClose, onUpload }) {
  const [files, setFiles] = useState([]); // [{ file, previewUrl }]
  const [category, setCategory] = useState(""); // selected/typed value
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  // Category combobox state
  const [allCats, setAllCats] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catQuery, setCatQuery] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const catBoxRef = useRef(null);

  // Reset when opening.
  useEffect(() => {
    if (open) {
      setFiles([]);
      setCategory("");
      setCatQuery("");
      setCatOpen(false);
      setSaving(false);
    }
  }, [open]);

  // Fetch existing categories once on open.
  useEffect(() => {
    if (!open) return;
    let active = true;
    setCatLoading(true);
    getGalleryCategories()
      .then((list) => active && setAllCats(Array.isArray(list) ? list : []))
      .catch(() => active && setAllCats([]))
      .finally(() => active && setCatLoading(false));
    return () => {
      active = false;
    };
  }, [open]);

  // Close category dropdown on outside click.
  useEffect(() => {
    if (!catOpen) return;
    const onClick = (e) => {
      if (catBoxRef.current && !catBoxRef.current.contains(e.target)) {
        setCatOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [catOpen]);

  // Revoke object URLs on unmount / change to avoid memory leaks.
  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
  }, [files]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // ── Category combobox helpers ──
  const q = catQuery.trim().toLowerCase();
  const filteredCats = q
    ? allCats.filter((c) => c.toLowerCase().includes(q))
    : allCats;
  const exactMatch = allCats.some((c) => c.toLowerCase() === q);
  const canAddNew = q.length > 0 && !exactMatch;

  const pickCat = (val) => {
    setCategory(val);
    setCatQuery(val);
    setCatOpen(false);
  };

  const onCatInput = (e) => {
    const val = e.target.value;
    setCatQuery(val);
    setCategory(val); // typed value IS the value
    setCatOpen(true);
  };

  const addFiles = (fileList) => {
    const imgs = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setFiles((prev) => [...prev, ...imgs]);
  };

  const removeAt = (idx) =>
    setFiles((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });

  const submit = async () => {
    if (files.length === 0) return;
    setSaving(true);
    try {
      const items = files.map(({ file, previewUrl }) => ({
        file,
        previewUrl,
        name: file.name,
        category: category.trim(),
      }));
      await onUpload?.(items);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Upload Images</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Category searchable combobox */}
          <div ref={catBoxRef} className="relative">
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              Category
              {catLoading && (
                <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
              )}
            </label>
            <input
              value={catQuery}
              onChange={onCatInput}
              onFocus={() => setCatOpen(true)}
              placeholder="Search or type new…"
              autoComplete="off"
              className={field}
            />

            {catOpen && (filteredCats.length > 0 || canAddNew) && (
              <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {filteredCats.map((c) => {
                  const selected = c === category;
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        onClick={() => pickCat(c)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm capitalize text-gray-700 hover:bg-gray-50"
                      >
                        {c}
                        {selected && <Check className="h-4 w-4 text-red-600" />}
                      </button>
                    </li>
                  );
                })}

                {canAddNew && (
                  <li className="border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => pickCat(catQuery.trim())}
                      className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Plus className="h-4 w-4" /> Add “{catQuery.trim()}”
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Dropzone / picker */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={[
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
              dragOver
                ? "border-red-400 bg-red-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
            ].join(" ")}
          >
            <UploadCloud className="h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-700">
              Click to browse or drag images here
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
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

          {/* Previews */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <img
                    src={f.previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeAt(i)}
                    className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving || files.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
              Upload {files.length > 0 ? `(${files.length})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
