"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Image as ImageIcon,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  getGallery,
  uploadGalleryImages,
  deleteGalleryImage,
} from "../../Services/GalleryApi.js";
import GalleryModal from "./GalleryModal";

const FILTERS = ["All", "Curtains", "Blinds"];
const MEDIA_FILTERS = ["All", "Images", "Videos"];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [mediaType, setMediaType] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGallery();
      setImages(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(
    () =>
      images.filter((img) => {
        const cat = (img.category || "").toLowerCase();
        const type = img.media?.type || "image";
        const matchesFilter = filter === "All" || cat === filter.toLowerCase();
        const matchesMedia =
          mediaType === "All" ||
          (mediaType === "Images" && type === "image") ||
          (mediaType === "Videos" && type === "video");
        const matchesQuery = (img.alt || "")
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesFilter && matchesMedia && matchesQuery;
      }),
    [images, filter, mediaType, query],
  );

  const handleUpload = async (items) => {
    // items from modal: [{ file, previewUrl, name, category }]
    // Backend shares one category/alt across the batch and has no per-image name,
    // so we map the modal's "name" onto the schema's "alt".
    const created = await uploadGalleryImages(
      items.map((it) => ({
        file: it.file,
        category: (it.category || "").toLowerCase(),
        alt: it.name,
      })),
    );
    setImages((list) => [...created, ...list]);
  };

  const handleDelete = async (img) => {
    if (!window.confirm(`Are you sure you want to delete this?`)) return;
    try {
      await deleteGalleryImage(img._id || img.id);
      setImages((list) =>
        list.filter((i) => (i._id || i.id) !== (img._id || img.id)),
      );
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
              <ImageIcon className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Media
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Gallery
            </h1>
            <p className="mt-1 text-gray-500">
              {images.length} item{images.length === 1 ? "" : "s"} in your
              collection.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            <Plus className="h-4 w-4" /> Add Media
          </button>
        </header>

        {/* Search + filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gallery..."
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

          {/* Media-type filter */}
          <div className="flex gap-2">
            {MEDIA_FILTERS.map((m) => (
              <button
                key={m}
                onClick={() => setMediaType(m)}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                  mediaType === m
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100",
                ].join(" ")}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading gallery...
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((img) => {
              const media = img.media || {};
              const src = media.url || img.url || "";
              const isVideo = media.type === "video";
              return (
                <div
                  key={img._id || img.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
                >
                  {isVideo ? (
                    <video
                      src={src}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={src}
                      alt={img.alt || ""}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {isVideo && (
                    <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Video
                    </span>
                  )}

                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex justify-end p-2">
                      <button
                        onClick={() => handleDelete(img)}
                        aria-label="Delete media"
                        className="rounded-lg bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {img.alt}
                      </p>
                      <p className="text-xs capitalize text-white/70">
                        {img.category}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-gray-500">No media found.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-3 text-sm font-semibold text-red-600 hover:underline"
            >
              Upload your first item
            </button>
          </div>
        )}
      </div>

      <GalleryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
