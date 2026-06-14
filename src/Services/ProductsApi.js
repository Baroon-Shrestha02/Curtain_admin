import api from "./BaseApi";

// GET /products?category=&subcategory=&page=&limit=&sort=&order=
export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data; // { success, data: [...], total, page, ... }
};

// GET /products/:slug
export const getProduct = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.data;
};

/**
 * Build a multipart FormData body from a plain form object.
 * Numeric fields sent as-is (server Number()-parses them).
 * specs / features / colors stringified (server JSON.parse()s them).
 * images: array of File objects -> appended under "images".
 */
function toFormData(form) {
  const fd = new FormData();
  const { images, colors, specs, features, ...rest } = form;

  Object.entries(rest).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") fd.append(key, val);
  });

  if (Array.isArray(specs)) fd.append("specs", JSON.stringify(specs));
  if (Array.isArray(features)) fd.append("features", JSON.stringify(features));
  if (Array.isArray(colors)) fd.append("colors", JSON.stringify(colors));

  if (images) {
    const list = Array.isArray(images) ? images : [images];
    list.forEach((file) => {
      if (file instanceof File) fd.append("images", file);
    });
  }

  return fd;
}

// POST /products
export const createProduct = async (form) => {
  const { data } = await api.post("/products", toFormData(form));
  return data.data;
};

// PATCH /products/:slug
export const updateProduct = async (slug, form) => {
  const { data } = await api.patch(`/products/${slug}`, toFormData(form));
  return data.data;
};

// DELETE /products/:slug
export const deleteProduct = async (slug) => {
  const { data } = await api.delete(`/products/${slug}`);
  return data;
};

// GET /categories
export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data.data; // [{_id, name, slug, ...}]
};

// GET /categories/:slug/subcategories
export const getSubcategoriesBySlug = async (slug) => {
  const { data } = await api.get(`/categories/${slug}/subcategories`);
  return data.data; // [{_id, name, slug, parent}]
};
