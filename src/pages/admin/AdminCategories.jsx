// src/pages/admin/AdminCategories.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../../context/Store.jsx";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { uploadImageUnsigned } from "../../lib/cloudinary";

/* ---------- Tiny UI helpers ---------- */
const Spinner = ({ className = "h-4 w-4" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>
);

function Toast({ open, kind = "success", message, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;
  const base =
    "fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] rounded-lg px-4 py-2 text-sm shadow-lg";
  const tone =
    kind === "error"
      ? "bg-red-600 text-white"
      : "bg-stone-900 text-white";
  return <div className={`${base} ${tone}`}>{message}</div>;
}

function Modal({ open, title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div ref={ref} className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-3 text-lg font-semibold">{title}</div>
        {children}
      </div>
    </div>
  );
}

/* ---------- Inputs ---------- */
function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="text-sm block">
      <div className="mb-1 text-stone-600">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />
    </label>
  );
}
function TextArea({ label, value, onChange, placeholder }) {
  return (
    <label className="text-sm block">
      <div className="mb-1 text-stone-600">{label}</div>
      <textarea
        rows="4"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />
    </label>
  );
}
function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-white p-3 animate-pulse">
      <div className="h-36 w-full rounded-lg bg-stone-200" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-32 rounded bg-stone-200" />
        <div className="h-3 w-24 rounded bg-stone-200" />
        <div className="h-3 w-full rounded bg-stone-200" />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function AdminCategories() {
  const { state, createCategory, updateCategory, deleteCategory } = useStore();

  const categories = useMemo(() => state?.categories ?? [], [state?.categories]);
  const loadingCollection = state?.categories === undefined; // first render before subscription

  const [form, setForm] = useState({
    id: "",
    name: "",
    image: "",
    description: "",
    featured: false,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, kind: "success", message: "" });

  // Confirm modals
  const [confirmDelete, setConfirmDelete] = useState(null); // {id,name,image}
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  const openToast = (kind, message) => setToast({ open: true, kind, message });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  /* ------ Image upload ------ */
  const onFile = async (file) => {
    try {
      setUploading(true);
      const { url } = await uploadImageUnsigned(file);
      setForm((f) => ({ ...f, image: url }));
      openToast("success", "Image uploaded");
    } catch (e) {
      console.error(e);
      openToast("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ------ Create/Update ------ */
  const submit = (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      openToast("error", "Name is required");
      return;
    }
    setConfirmSaveOpen(true);
  };

  const doSave = async () => {
    setConfirmSaveOpen(false);
    setSaving(true);
    try {
      const id = form.id || form.name.toLowerCase().replace(/\s+/g, "-");
      const payload = {
        id,
        name: form.name.trim(),
        image: form.image || "",
        description: form.description || "",
        featured: !!form.featured,
        updatedAt: new Date().toISOString(),
        ...(form.id ? {} : { createdAt: new Date().toISOString() }),
      };
      if (form.id) await updateCategory(payload);
      else await createCategory(payload);

      setForm({ id: "", name: "", image: "", description: "", featured: false });
      openToast("success", form.id ? "Collection updated" : "Collection created");
    } catch (e) {
      console.error(e);
      openToast("error", "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ------ Delete ------ */
  const askDelete = (c) => setConfirmDelete(c);
  const doDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await deleteCategory(confirmDelete.id, confirmDelete.name);
      openToast("success", "Collection deleted");
    } catch (e) {
      console.error(e);
      openToast("error", "Delete failed");
    } finally {
      setSaving(false);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Collections / Categories</h1>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="relative rounded-xl border bg-white p-6 shadow-sm space-y-4"
      >
        {/* top linear progress while saving */}
        {saving && (
          <div className="absolute left-0 top-0 h-0.5 w-full overflow-hidden rounded-t-xl">
            <div className="h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite] bg-stone-900" />
          </div>
        )}

        <style>{`
          @keyframes loading {
            0% { transform: translateX(-120%); }
            50% { transform: translateX(40%); }
            100% { transform: translateX(140%); }
          }
        `}</style>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Input
            label="Image URL"
            value={form.image}
            onChange={(v) => setForm({ ...form, image: v })}
            placeholder="https://…"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextArea
            label="Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            placeholder="Describe the mood, theme, or artistic focus of this collection…"
          />
          <div className="text-sm">
            <div className="mb-1 text-stone-600">Upload Image</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
            {uploading && (
              <div className="mt-2 inline-flex items-center gap-2 text-xs text-stone-500">
                <Spinner /> Uploading…
              </div>
            )}
            {form.image && (
              <div className="mt-2">
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-32 w-full rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured Collection
          </label>
        </div>

        <div className="pt-1 flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2 text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {saving ? <Spinner /> : <Check size={16} />} {form.id ? "Update" : "Create"}
          </button>
          {form.id && (
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                setForm({ id: "", name: "", image: "", description: "", featured: false })
              }
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-2 disabled:opacity-60"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loadingCollection
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : categories.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md"
              >
                <img
                  src={c.image || "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={c.name}
                  className="h-36 w-full rounded-lg object-cover"
                />
                <div className="mt-3 flex items-start justify-between">
                  <div className="pr-3">
                    <div className="font-medium text-stone-900">{c.name}</div>
                    <div className="text-xs text-stone-500">id: {c.id}</div>
                    {c.description && (
                      <p className="mt-1 text-xs text-stone-600 line-clamp-3">
                        {c.description}
                      </p>
                    )}
                    {c.featured && (
                      <div className="mt-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded border p-1"
                      onClick={() => setForm({
                        id: c.id,
                        name: c.name || "",
                        image: c.image || "",
                        description: c.description || "",
                        featured: !!c.featured,
                      })}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="rounded border p-1 text-red-600"
                      onClick={() => askDelete({ id: c.id, name: c.name, image: c.image })}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Confirm Save */}
      <Modal
        open={confirmSaveOpen}
        title={form.id ? "Confirm Update" : "Create Collection"}
        onClose={() => setConfirmSaveOpen(false)}
      >
        <p className="text-sm text-stone-600">
          {form.id
            ? "Apply these changes to this collection?"
            : "Create this new collection with the provided details?"}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-lg border px-4 py-2"
            onClick={() => setConfirmSaveOpen(false)}
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-white hover:bg-stone-800"
            onClick={doSave}
          >
            <Check size={16} /> Confirm
          </button>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <Modal
        open={!!confirmDelete}
        title="Delete Collection?"
        onClose={() => setConfirmDelete(null)}
      >
        <div className="flex items-start gap-3">
          <img
            src={confirmDelete?.image || "https://via.placeholder.com/120x80?text=No+Image"}
            alt=""
            className="h-16 w-24 rounded object-cover"
          />
          <p className="text-sm text-stone-700">
            You’re about to permanently delete{" "}
            <span className="font-semibold">{confirmDelete?.name}</span>. This
            action cannot be undone.
          </p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-lg border px-4 py-2" onClick={() => setConfirmDelete(null)}>
            Cancel
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500"
            onClick={doDelete}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </Modal>

      <Toast open={toast.open} kind={toast.kind} message={toast.message} onClose={closeToast} />
    </div>
  );
}
