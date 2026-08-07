import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Package, X, ArrowUp, ArrowDown } from "lucide-react";
import apiClient from "../api/client";
import ImageUploader from "../components/common/ImageUploader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import TranslationsEditor from "../components/common/TranslationsEditor";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stock: 0,
  category: "",
  isActive: true,
  images: [], // [{ imageUrl, displayOrder }]
  translations: "",
};

function productToFormValues(product) {
  if (!product) return emptyProduct;
  return {
    ...product,
    images: [...(product.images || [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
  };
}

function formValuesToPayload(values) {
  return {
    name: values.name,
    description: values.description,
    price: values.price === "" ? null : Number(values.price),
    stock: values.stock === "" ? 0 : Number(values.stock),
    category: values.category,
    isActive: values.isActive,
    translations: values.translations,
    images: values.images.map((img, index) => ({ imageUrl: img.imageUrl, displayOrder: index })),
  };
}

function ProductPhotoManager({ images, onChange }) {
  const addPhoto = (url) => {
    if (!url) return;
    onChange([...images, { imageUrl: url, displayOrder: images.length }]);
  };
  const removeAt = (index) => onChange(images.filter((_, i) => i !== index));
  const moveAt = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Product Photos (first photo = main cover image)
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {images.map((img, index) => (
            <div key={`${img.imageUrl}-${index}`} className="relative group">
              <img
                src={img.imageUrl}
                alt=""
                className="w-full aspect-square object-cover rounded-lg border border-slate-200"
              />
              <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
              <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                <button type="button" onClick={() => moveAt(index, -1)} disabled={index === 0} className="bg-white/90 rounded p-0.5 disabled:opacity-30">
                  <ArrowUp size={12} />
                </button>
                <button type="button" onClick={() => moveAt(index, 1)} disabled={index === images.length - 1} className="bg-white/90 rounded p-0.5 disabled:opacity-30">
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageUploader label="Upload another photo" value="" onChange={addPhoto} />
    </div>
  );
}

function ProductFormModal({ initialItem, onClose, onSave, saving }) {
  const [values, setValues] = useState(productToFormValues(initialItem));
  const [error, setError] = useState("");

  useEffect(() => setValues(productToFormValues(initialItem)), [initialItem]);

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!values.name) {
      setError("Product name is required");
      return;
    }
    if (values.price !== "" && Number(values.price) < 0) {
      setError("Price cannot be negative");
      return;
    }
    if (values.stock !== "" && Number(values.stock) < 0) {
      setError("Stock cannot be negative");
      return;
    }
    try {
      await onSave(formValuesToPayload(values));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">{initialItem ? "Edit Product" : "Add Product"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.category}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="e.g. Wellness Kits, Health Packages"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={values.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={values.stock}
                onChange={(e) => setField("stock", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>

          <ProductPhotoManager images={values.images} onChange={(imgs) => setField("images", imgs)} />

          <TranslationsEditor
            value={values.translations}
            onChange={(json) => setField("translations", json)}
            fields={[
              { name: "name", label: "Product Name", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
            ]}
          />

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={!!values.isActive} onChange={(e) => setField("isActive", e.target.checked)} />
            Visible on website
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-md bg-brand text-white hover:bg-brand-dark transition disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/products");
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await apiClient.put(`/api/products/${editingProduct.id}`, payload);
      } else {
        await apiClient.post("/api/products", payload);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/api/products/${deleteTarget.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-slate-800">Products</h1>
        <button
          onClick={() => { setEditingProduct(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark transition"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-10 justify-center">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-14 text-slate-400 text-sm border border-dashed border-slate-300 rounded-lg">
          No products yet — click "Add Product" to create the first one.
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => {
            const sortedImages = [...(product.images || [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
            return (
              <div key={product.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
                {sortedImages[0]?.imageUrl ? (
                  <img src={sortedImages[0].imageUrl} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" />
                ) : (
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                    <Package size={16} className="text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {product.price != null ? `₹${product.price}` : "No price set"} · Stock: {product.stock ?? 0}
                  </p>
                </div>
                <button onClick={() => { setEditingProduct(product); setModalOpen(true); }} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <ProductFormModal initialItem={editingProduct} saving={saving} onClose={() => setModalOpen(false)} onSave={handleSave} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        message="This can't be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
