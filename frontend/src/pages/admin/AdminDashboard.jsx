import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { productAPI } from "../../api/axios";
import api from "../../api/axios";          // default export = axios instance (has auth headers)
import "../../styles/admin.css";

const EMPTY_FORM = {
  name: "", description: "", price: "", mrp: "",
  category: "Home", tag: "", image: "", inStock: true,
};

const CATEGORIES = ["All", "Home", "Kitchen", "Pooja", "Personal"];
const TAGS       = ["All", "", "Bestseller", "New", "Eco Pick", "Popular"];

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null); // "add" | "edit" | null
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formError, setFormError]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [toast, setToast]           = useState(null);
  const [search, setSearch]         = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterTag, setFilterTag]   = useState("All");

  // Image upload state
  const [imageMode, setImageMode]           = useState("url"); // "upload" | "url"
  const [imagePreview, setImagePreview]     = useState("");
  const [uploading, setUploading]           = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── Fetch products ─────────────────────────────────────────
  const fetchProducts = () => {
    setLoading(true);
    productAPI
      .getAdminAll()
      .then((res) => setProducts(res.data.data || []))
      .catch(() => showToast("Failed to load products", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Open modals ────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormError("");
    setImagePreview("");
    setImageMode("upload");
    setModal("add");
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description,
      price: String(p.price), mrp: String(p.mrp),
      category: p.category, tag: p.tag || "",
      image: p.image, inStock: p.inStock,
    });
    setEditId(p._id);
    setFormError("");
    setImagePreview(p.image);
    setImageMode(p.image?.includes("/uploads/") ? "upload" : "url");
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setImagePreview("");
    setUploadProgress(0);
  };

  // ── Form field change ──────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ── Upload image using axios (already has auth token) ──────
  const handleFilePick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image too large. Max 5MB allowed.");
      return;
    }

    setImagePreview(URL.createObjectURL(file)); // instant preview
    setFormError("");

    try {
      setUploading(true);
      setUploadProgress(40);

      const formData = new FormData();
      formData.append("image", file);

      // Use axios instance — it already sends Authorization header automatically
      // Delete default Content-Type so axios sets multipart/form-data with boundary automatically
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": undefined },
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded * 80) / e.total));
        },
      });

      setUploadProgress(100);
      setForm((p) => ({ ...p, image: res.data.imageUrl }));
      setImagePreview(res.data.imageUrl);
      showToast("Image uploaded ✓");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setFormError("Upload not available yet. Please use 'Paste URL' tab instead.");
        setImageMode("url");
      } else {
        setFormError(err?.response?.data?.message || "Upload failed. Try again.");
      }
      setImagePreview("");
      setForm((p) => ({ ...p, image: "" }));
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 800);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── URL input ──────────────────────────────────────────────
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setForm((p) => ({ ...p, image: url }));
    setImagePreview(url);
  };

  // ── Submit form ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.description || !form.price || !form.mrp || !form.image) {
      setFormError("Please fill all required fields including the product image.");
      return;
    }
    if (Number(form.price) > Number(form.mrp)) {
      setFormError("Price cannot be greater than MRP.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price), mrp: Number(form.mrp) };
      if (modal === "add") {
        await productAPI.create(payload);
        showToast("Product added successfully!");
      } else {
        await productAPI.update(editId, payload);
        showToast("Product updated successfully!");
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await productAPI.delete(deleteId);
      showToast("Product deleted");
      setDeleteId(null);
      fetchProducts();
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  // ── Filter ─────────────────────────────────────────────────
  const norm = search.trim().toLowerCase();
  const filteredProducts = products.filter((p) => {
    const matchSearch   = !norm || p.name.toLowerCase().includes(norm) || p.description.toLowerCase().includes(norm);
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    const matchTag      = filterTag === "All" || (filterTag === "" ? !p.tag : p.tag === filterTag);
    return matchSearch && matchCategory && matchTag;
  });

  return (
    <div className="admin-page">

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-left">
          <div className="admin-logo">
            <span className="admin-logo-icon">🎍</span>
            <div>
              <div className="admin-logo-title">HanBamboo</div>
              <div className="admin-logo-subtitle">Admin</div>
            </div>
          </div>
          <nav className="admin-nav">
            <button className="admin-nav-item admin-nav-item-active">📦 Products</button>
          </nav>
        </div>
        <div className="admin-sidebar-right">
          <div className="admin-email">{admin?.email}</div>
          {/* logout comes from AuthContext — clears token + sets admin=null → redirects to login */}
          <button onClick={logout} className="btn-ghost-danger">Sign out</button>
        </div>
      </aside>

      {/* Mobile topbar — only visible on small screens where sidebar is hidden */}
      <div className="admin-mobile-bar">
        <div className="admin-mobile-logo">
          <span>🎍</span>
          <span className="admin-logo-title">HanBamboo Admin</span>
        </div>
        <button onClick={logout} className="admin-mobile-signout">Sign out</button>
      </div>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-title">Products</h1>
            <p className="admin-subtitle">{products.length} total products in database</p>
          </div>
          <button onClick={openAdd} className="btn-primary">+ Add product</button>
        </header>

        {/* Controls */}
        <section className="admin-controls">
          <div className="admin-control-group">
            <input type="search" placeholder="Search by name or description…"
              value={search} onChange={(e) => setSearch(e.target.value)} className="input" />
          </div>
          <div className="admin-control-group">
            <label className="control-label">Category</label>
            <select className="input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>)}
            </select>
          </div>
          <div className="admin-control-group">
            <label className="control-label">Tag</label>
            <select className="input" value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
              {TAGS.map((t) => <option key={String(t)} value={t}>{t === "All" ? "All tags" : t || "— None —"}</option>)}
            </select>
          </div>
        </section>

        {/* Content */}
        {loading ? (
          <div className="admin-loader">Loading products…</div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty">
            <h2>No products found</h2>
            {products.length === 0
              ? <p>You have not added any products yet.</p>
              : <p>Try changing your search or filters.</p>}
            <button onClick={openAdd} className="btn-primary">+ Add product</button>
          </div>
        ) : (
          <section className="admin-content">
            {/* Desktop table */}
            <div className="table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product</th><th>Category</th><th>Price</th>
                    <th>MRP</th><th>Tag</th><th>Stock</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="product-cell">
                          <img src={p.image} alt={p.name} className="product-thumb"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/52x52/E8D5B7/1B4332?text=🎍"; }} />
                          <div>
                            <div className="product-name">{p.name}</div>
                            <div className="product-desc">{p.description.slice(0, 60)}{p.description.length > 60 ? "…" : ""}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="pill pill-category">{p.category}</span></td>
                      <td><strong>₹{p.price}</strong></td>
                      <td><span className="mrp-crossed">₹{p.mrp}</span></td>
                      <td>{p.tag ? <span className="pill pill-tag">{p.tag}</span> : "—"}</td>
                      <td>
                        <span className={`pill pill-stock ${p.inStock ? "pill-stock-in" : "pill-stock-out"}`}>
                          {p.inStock ? "In stock" : "Out of stock"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => openEdit(p)} className="btn-chip">Edit</button>
                          <button onClick={() => setDeleteId(p._id)} className="btn-chip-danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="product-card-list">
              {filteredProducts.map((p) => (
                <article key={p._id} className="product-card">
                  <div className="product-card-header">
                    <img src={p.image} alt={p.name} className="product-card-thumb"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80/E8D5B7/1B4332?text=🎍"; }} />
                    <div className="product-card-main">
                      <div className="product-name">{p.name}</div>
                      <div className="product-desc">{p.description.slice(0, 80)}{p.description.length > 80 ? "…" : ""}</div>
                    </div>
                  </div>
                  <div className="product-card-meta">
                    <span className="pill pill-category">{p.category}</span>
                    {p.tag && <span className="pill pill-tag pill-tag-small">{p.tag}</span>}
                  </div>
                  <div className="product-card-pricing">
                    <span className="price">₹{p.price}</span>
                    <span className="mrp-crossed">₹{p.mrp}</span>
                    <span className={`pill pill-stock pill-stock-small ${p.inStock ? "pill-stock-in" : "pill-stock-out"}`}>
                      {p.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                  <div className="product-card-actions">
                    <button onClick={() => openEdit(p)} className="btn-secondary">Edit</button>
                    <button onClick={() => setDeleteId(p._id)} className="btn-danger">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ══════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════ */}
      {modal && (
        <>
          <div className="backdrop" onClick={closeModal} />
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{modal === "add" ? "Add new product" : "Edit product"}</h3>
              <button type="button" className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {formError && <div className="form-error">{formError}</div>}

            <form onSubmit={handleSubmit} className="modal-form">

              {/* ── IMAGE SECTION ── */}
              <div className="field">
                <label className="field-label">Product Image *</label>

                <div className="img-tabs">
                  <button type="button"
                    className={`img-tab ${imageMode === "upload" ? "img-tab-on" : ""}`}
                    onClick={() => setImageMode("upload")}>
                    📁 Upload from Gallery
                  </button>
                  <button type="button"
                    className={`img-tab ${imageMode === "url" ? "img-tab-on" : ""}`}
                    onClick={() => setImageMode("url")}>
                    🔗 Paste URL
                  </button>
                </div>

                {/* Upload zone */}
                {imageMode === "upload" && (
                  <div
                    className={`upload-zone ${uploading ? "upload-zone-busy" : ""}`}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="upload-preview-wrap">
                        <img src={imagePreview} alt="Preview" className="upload-preview-img"
                          onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        <div className="upload-preview-hover">Click to change</div>
                      </div>
                    ) : (
                      <div className="upload-empty">
                        <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                        <p style={{ fontWeight: 700, color: "#1B4332", margin: 0 }}>Click to pick photo from gallery</p>
                        <p style={{ fontSize: 12, color: "#B0A090", marginTop: 4 }}>JPG, PNG, WebP — max 5MB</p>
                      </div>
                    )}
                    {uploading && (
                      <>
                        <div className="upload-progress-bar">
                          <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <div className="upload-busy-label">⏳ Uploading…</div>
                      </>
                    )}
                  </div>
                )}

                <input ref={fileInputRef} type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }} onChange={handleFilePick} />

                {/* URL input */}
                {imageMode === "url" && (
                  <div>
                    <input className="input" placeholder="https://example.com/image.jpg"
                      value={form.image} onChange={handleUrlChange} />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="url-preview-img"
                        onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    )}
                  </div>
                )}
              </div>

              {/* ── PRODUCT DETAILS (original layout) ── */}
              <div className="modal-grid-2">
                <MField label="Product name *" name="name" value={form.name} onChange={handleChange} required />
              </div>

              <MField label="Description *" name="description" value={form.description}
                onChange={handleChange} required textarea />

              <div className="modal-grid-3">
                <MField label="Price (₹) *" name="price" value={form.price} onChange={handleChange}
                  required type="number" min={0} helper="Amount customer will pay." />
                <MField label="MRP (₹) *" name="mrp" value={form.mrp} onChange={handleChange}
                  required type="number" min={0} helper="Maximum retail price." />
                <div>
                  <label className="field-label">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input" required>
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="modal-grid-2">
                <div>
                  <label className="field-label">Tag</label>
                  <select name="tag" value={form.tag} onChange={handleChange} className="input">
                    <option value="">— None —</option>
                    {TAGS.filter((t) => t && t !== "All").map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field-inline">
                  <input type="checkbox" id="inStock" name="inStock" checked={form.inStock} onChange={handleChange} />
                  <label htmlFor="inStock">In stock</label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting || uploading}>
                  {uploading ? "Uploading image…" : submitting ? "Saving…" : modal === "add" ? "Add product" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <>
          <div className="backdrop" onClick={() => setDeleteId(null)} />
          <div className="modal modal-small">
            <h3 className="modal-title">Delete product?</h3>
            <p className="modal-text">This action cannot be undone.</p>
            <div className="modal-footer modal-footer-inline">
              <button type="button" onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button type="button" onClick={handleDelete} className="btn-danger">Yes, delete</button>
            </div>
          </div>
        </>
      )}

      <style>{UPLOAD_CSS}</style>
    </div>
  );
};

const UPLOAD_CSS = `
  .img-tabs { display:flex; gap:8px; margin-bottom:10px; }
  .img-tab {
    flex:1; padding:9px 12px; border-radius:8px;
    border:2px solid #e2e8f0; background:#fff;
    font-size:13px; font-weight:600; cursor:pointer; color:#64748b;
    transition:all .15s;
  }
  .img-tab:hover { border-color:#E8A44A; color:#E8A44A; }
  .img-tab-on { background:#E8A44A !important; color:#fff !important; border-color:#E8A44A !important; }

  .upload-zone {
    border:2px dashed #cbd5e1; border-radius:10px; background:#f8fafc;
    cursor:pointer; min-height:150px;
    display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden; transition:border-color .2s;
  }
  .upload-zone:hover { border-color:#E8A44A; }
  .upload-zone-busy  { cursor:wait; }
  .upload-empty { text-align:center; padding:28px 16px; }
  .upload-preview-wrap { position:relative; width:100%; }
  .upload-preview-img  { width:100%; height:180px; object-fit:cover; display:block; }
  .upload-preview-hover {
    position:absolute; inset:0; background:rgba(0,0,0,.45); color:#fff;
    font-weight:700; font-size:14px;
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .2s;
  }
  .upload-zone:hover .upload-preview-hover { opacity:1; }
  .upload-progress-bar {
    position:absolute; bottom:0; left:0; right:0;
    height:4px; background:#e2e8f0;
  }
  .upload-progress-fill {
    height:100%; background:linear-gradient(90deg,#E8A44A,#C84B31);
    transition:width .3s ease;
  }
  .upload-busy-label {
    position:absolute; top:8px; right:8px;
    background:rgba(27,67,50,.85); color:#fff;
    font-size:11px; font-weight:700; padding:4px 10px; border-radius:50px;
  }
  .url-preview-img { width:100%; height:140px; object-fit:cover; border-radius:8px; margin-top:10px; }
`;

const MField = ({ label, name, value, onChange, required, type = "text", placeholder, min, textarea, helper }) => (
  <div className="field">
    <label className="field-label">
      {label}{required && <span className="field-required">*</span>}
    </label>
    {textarea ? (
      <textarea name={name} value={value} onChange={onChange} required={required} rows={3} className="input textarea" />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} required={required}
        placeholder={placeholder} min={min} className="input" />
    )}
    {helper && <div className="field-helper">{helper}</div>}
  </div>
);

export default AdminDashboard;