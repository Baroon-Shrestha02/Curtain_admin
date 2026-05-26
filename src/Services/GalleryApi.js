import api from "./BaseApi";

// GET /gallery?category=
export const getGallery = async (params = {}) => {
  const { data } = await api.get("/gallery", { params });
  return data; // { success, count, data: [...] }
};

/**
 * Upload many images in ONE request (controller does insertMany).
 * items: [{ file, category, alt? }]  — category/alt are shared for the batch,
 * so we take them from the first item.
 * Returns the array of created docs.
 */
export const uploadGalleryImages = async (items) => {
  if (!items || items.length === 0) return [];

  const fd = new FormData();
  items.forEach((it) => fd.append("images", it.file)); // field name MUST be "images"

  const first = items[0];
  if (first.category) fd.append("category", first.category);
  if (first.alt) fd.append("alt", first.alt);

  const { data } = await api.post("/gallery", fd);
  return data.data; // array of new Gallery docs
};

// Convenience single-image wrapper (still hits the same endpoint).
export const uploadGalleryImage = async (item) => {
  const [doc] = await uploadGalleryImages([item]);
  return doc;
};

// DELETE /gallery/:id
export const deleteGalleryImage = async (id) => {
  const { data } = await api.delete(`/gallery/${id}`);
  return data;
};

export const getGalleryCategories = async () => {
  const { data } = await api.get("/gallery/categories");
  return data.data; // ["curtains", "blinds", ...]
};
