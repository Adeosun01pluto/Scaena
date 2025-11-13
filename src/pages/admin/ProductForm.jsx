// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useStore } from "../../context/Store.jsx";
// import { uploadImageUnsigned } from "../../lib/cloudinary";
// import TinyConfirm from "../../components/admin/TinyConfirm.jsx";
// import TinySpinner from "../../components/admin/TinySpinner.jsx";

// const AVAILABILITY = ["Available for Sale", "Sold", "On Hold", "Not for Sale"];
// const RARITY = ["Unique", "Limited Edition", "Open Edition"];
// const UNITS = ["in", "cm"];
// const MEDIA = ["Painting", "Drawing", "Sculpture", "Print", "Photography", "Digital"];

// export default function ProductForm() {
//   const { state, createArtwork, updateArtwork, createSupply, updateSupply } = useStore();
//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const params = new URLSearchParams(search);
//   const editingId = params.get("id");
//   const kindHint = params.get("kind"); // "art" | "supply"

//   const existing = useMemo(() => {
//     const all = [...state.artworks, ...state.supplies];
//     return all.find((x) => x.id === editingId);
//   }, [editingId, state.artworks, state.supplies]);

//   const [form, setForm] = useState({
//     id: "",
//     type: "Art",
//     name: "",
//     image: "",
//     price: "",
//     currency: "USD",
//     collectionId: "",
//     category: "",
//     year: new Date().getFullYear(),
//     rarity: "Unique",
//     availability: "Available for Sale",
//     medium: "Painting",
//     materials: "",
//     subject: "",
//     styles: [],
//     tags: [],
//     dimensions: { h: "", w: "", d: "", unit: "in" },
//     description: "",
//   });

//   useEffect(() => {
//     if (existing) {
//       setForm({
//         id: existing.id,
//         type: existing.type ?? (kindHint === "supply" ? "Supply" : "Art"),
//         name: existing.name ?? "",
//         image: existing.image ?? existing.imageUrl ?? "",
//         price: existing.price ?? "",
//         currency: existing.currency ?? "USD",
//         collectionId: existing.collectionId ?? existing.categoryId ?? "",
//         category: existing.category ?? "",
//         year: existing.year ?? new Date().getFullYear(),
//         rarity: existing.rarity ?? "Unique",
//         availability: existing.availability ?? "Available for Sale",
//         medium: existing.medium ?? "Painting",
//         materials: existing.materials ?? "",
//         subject: existing.subject ?? "",
//         styles: existing.styles ?? [],
//         tags: existing.tags ?? [],
//         dimensions: existing.dimensions ?? { h: "", w: "", d: "", unit: "in" },
//         description: existing.description ?? "",
//       });
//     } else if (kindHint === "supply") {
//       setForm((f) => ({ ...f, type: "Supply" }));
//     }
//   }, [existing, kindHint]);

//   // upload state
//   const [uploading, setUploading] = useState(false);
//   const onFile = async (file) => {
//     try {
//       setUploading(true);
//       const { url } = await uploadImageUnsigned(file);
//       setForm((f) => ({ ...f, image: url }));
//     } finally {
//       setUploading(false);
//     }
//   };

//   // confirm + saving states
//   const [confirmSave, setConfirmSave] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const doSave = async () => {
//     const payload = {
//       ...form,
//       id:
//         form.id ||
//         (form.type === "Art"
//           ? `art-${crypto.randomUUID().slice(0, 6)}`
//           : `sup-${crypto.randomUUID().slice(0, 6)}`),
//       price: Number(form.price || 0),
//       imageUrl: form.image,
//       categoryId: form.collectionId || form.category?.toLowerCase(),
//       updatedAt: new Date().toISOString(),
//       ...(form.id ? {} : { createdAt: new Date().toISOString() }),
//     };

//     setSaving(true);
//     try {
//       if (form.type === "Art") {
//         existing ? await updateArtwork(payload) : await createArtwork(payload);
//       } else {
//         existing ? await updateSupply(payload) : await createSupply(payload);
//       }
//       navigate("/admin/products");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const addChip = (key, value, limit) => {
//     setForm((f) => {
//       const arr = Array.isArray(f[key]) ? f[key] : [];
//       const v = (value || "").trim();
//       if (!v || arr.includes(v)) return f;
//       if (limit && arr.length >= limit) return f;
//       return { ...f, [key]: [...arr, v] };
//     });
//   };
//   const removeChip = (key, value) =>
//     setForm((f) => ({ ...f, [key]: f[key].filter((x) => x !== value) }));

//   const submit = (e) => {
//     e.preventDefault();
//     // basic validation
//     if (!form.name) return alert("Please enter a product name.");
//     if (!form.price && form.type !== "Supply") {
//       // still allow supplies without price if you prefer
//     }
//     setConfirmSave(true); // open confirmation modal
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold">
//         {existing ? "Edit" : "New"} {form.type}
//       </h1>

//       {/* saving overlay */}
//       {saving && (
//         <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/20">
//           <div className="rounded-xl bg-white px-4 py-3 shadow">
//             <div className="flex items-center gap-2 text-sm">
//               <TinySpinner />
//               <span>Saving…</span>
//             </div>
//           </div>
//         </div>
//       )}

//       <form onSubmit={submit} className="rounded-xl border bg-white p-6 space-y-6">
//         {/* Basic */}
//         <div className="grid gap-4 md:grid-cols-2">
//           <Select
//             label="Type"
//             value={form.type}
//             onChange={(v) => setForm({ ...form, type: v })}
//             options={["Art", "Supply"]}
//           />
//           <Input
//             label="Name"
//             value={form.name}
//             onChange={(v) => setForm({ ...form, name: v })}
//           />
//         </div>

//         {/* Collection / Category */}
//         <div className="grid gap-4 md:grid-cols-3">
//           <Select
//             label="Collection (Category)"
//             value={form.collectionId}
//             onChange={(v) => setForm({ ...form, collectionId: v })}
//             options={["", ...state.categories.map((c) => c.id)]}
//           />
//           <Input
//             label="Category (display name)"
//             value={form.category}
//             onChange={(v) => setForm({ ...form, category: v })}
//             placeholder="Optional — e.g., Abstractum"
//           />
//           <Input
//             label="Year Created"
//             type="number"
//             value={form.year}
//             onChange={(v) => setForm({ ...form, year: Number(v || 0) })}
//           />
//         </div>

//         {/* Image */}
//         <div className="grid gap-4 md:grid-cols-3">
//           <Input
//             label="Image URL"
//             value={form.image}
//             onChange={(v) => setForm({ ...form, image: v })}
//           />
//           <div className="text-sm">
//             <div className="mb-1 text-stone-600">Upload</div>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
//             />
//             {uploading && (
//               <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
//                 <TinySpinner /> Uploading…
//               </div>
//             )}
//           </div>
//           <div className="rounded-lg border">
//             <div className="bg-stone-50 px-3 py-2 text-xs font-medium uppercase text-stone-500">
//               Preview
//             </div>
//             <div className="p-3">
//               {form.image ? (
//                 <img
//                   src={form.image}
//                   alt=""
//                   className="h-40 w-full rounded object-cover"
//                 />
//               ) : (
//                 <div className="flex h-40 items-center justify-center text-sm text-stone-500">
//                   No image
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Pricing & Availability */}
//         <div className="grid gap-4 md:grid-cols-4">
//           <Select
//             label="Availability"
//             value={form.availability}
//             onChange={(v) => setForm({ ...form, availability: v })}
//             options={AVAILABILITY}
//           />
//           <Select
//             label="Rarity"
//             value={form.rarity}
//             onChange={(v) => setForm({ ...form, rarity: v })}
//             options={RARITY}
//           />
//           <Select
//             label="Currency"
//             value={form.currency}
//             onChange={(v) => setForm({ ...form, currency: v })}
//             options={["USD", "EUR", "GBP", "NGN"]}
//           />
//           <Input
//             label="Price"
//             type="number"
//             step="0.01"
//             value={form.price}
//             onChange={(v) => setForm({ ...form, price: v })}
//           />
//         </div>

//         {/* Dimensions */}
//         <fieldset className="rounded-lg border p-4">
//           <legend className="px-1 text-xs font-semibold text-stone-500">
//             Dimensions
//           </legend>
//           <div className="grid gap-3 md:grid-cols-5">
//             <Input
//               label="Height"
//               type="number"
//               value={form.dimensions.h}
//               onChange={(v) =>
//                 setForm({ ...form, dimensions: { ...form.dimensions, h: v } })
//               }
//             />
//             <Input
//               label="Width"
//               type="number"
//               value={form.dimensions.w}
//               onChange={(v) =>
//                 setForm({ ...form, dimensions: { ...form.dimensions, w: v } })
//               }
//             />
//             <Input
//               label="Depth"
//               type="number"
//               value={form.dimensions.d}
//               onChange={(v) =>
//                 setForm({ ...form, dimensions: { ...form.dimensions, d: v } })
//               }
//             />
//             <Select
//               label="Unit"
//               value={form.dimensions.unit}
//               onChange={(v) =>
//                 setForm({ ...form, dimensions: { ...form.dimensions, unit: v } })
//               }
//               options={UNITS}
//             />
//             <div className="flex items-end text-sm text-stone-500">
//               {form.dimensions.h && form.dimensions.w
//                 ? `${form.dimensions.h} × ${form.dimensions.w}${
//                     form.dimensions.d ? ` × ${form.dimensions.d}` : ""
//                   } ${form.dimensions.unit}`
//                 : "—"}
//             </div>
//           </div>
//         </fieldset>

//         {/* Medium & descriptors (art only) */}
//         {form.type === "Art" && (
//           <>
//             <div className="grid gap-4 md:grid-cols-3">
//               <Select
//                 label="Medium"
//                 value={form.medium}
//                 onChange={(v) => setForm({ ...form, medium: v })}
//                 options={MEDIA}
//               />
//               <Input
//                 label="Materials"
//                 value={form.materials}
//                 onChange={(v) => setForm({ ...form, materials: v })}
//                 placeholder="e.g., Oil on Canvas"
//               />
//               <Input
//                 label="Subject"
//                 value={form.subject}
//                 onChange={(v) => setForm({ ...form, subject: v })}
//                 placeholder="e.g., People and Portraits"
//               />
//             </div>

//             <Chips
//               label="Styles (up to 3)"
//               placeholder="Type style then Enter…"
//               values={form.styles}
//               limit={3}
//               onAdd={(v) => addChip("styles", v, 3)}
//               onRemove={(v) => removeChip("styles", v)}
//             />
//             <Chips
//               label="Tags (up to 5)"
//               placeholder="Type tag then Enter…"
//               values={form.tags}
//               limit={5}
//               onAdd={(v) => addChip("tags", v, 5)}
//               onRemove={(v) => removeChip("tags", v)}
//             />
//           </>
//         )}

//         <TextArea
//           label="Description"
//           value={form.description}
//           onChange={(v) => setForm({ ...form, description: v })}
//           placeholder="Brief, compelling description for collectors…"
//         />

//         <div className="pt-2 flex items-center gap-2">
//           <button
//             disabled={saving}
//             className="rounded-lg bg-stone-900 px-5 py-2 text-white hover:bg-stone-800 disabled:opacity-60"
//           >
//             {existing ? "Update" : "Create"}
//           </button>
//           <button
//             type="button"
//             className="rounded-lg border px-5 py-2"
//             onClick={() => navigate(-1)}
//             disabled={saving}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>

//       {/* Confirm create/update */}
//       <TinyConfirm
//         open={confirmSave}
//         title={existing ? "Update product?" : "Create product?"}
//         message={
//           existing
//             ? "Save your changes to this product?"
//             : "Create this new product with the provided details?"
//         }
//         confirmText={existing ? "Save Changes" : "Create"}
//         onClose={() => setConfirmSave(false)}
//         onConfirm={doSave}
//       />
//     </div>
//   );
// }

// /* ---------- small inputs ---------- */
// function Input({ label, value, onChange, type = "text", step, placeholder }) {
//   return (
//     <label className="text-sm block">
//       <div className="mb-1 text-stone-600">{label}</div>
//       <input
//         type={type}
//         step={step}
//         value={value}
//         placeholder={placeholder}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-lg border px-3 py-2"
//       />
//     </label>
//   );
// }
// function Select({ label, value, onChange, options }) {
//   return (
//     <label className="text-sm block">
//       <div className="mb-1 text-stone-600">{label}</div>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-lg border px-3 py-2"
//       >
//         {options.map((o, i) => (
//           <option key={i} value={o}>
//             {o || "—"}
//           </option>
//         ))}
//       </select>
//     </label>
//   );
// }
// function TextArea({ label, value, onChange, placeholder }) {
//   return (
//     <label className="text-sm block">
//       <div className="mb-1 text-stone-600">{label}</div>
//       <textarea
//         rows="4"
//         value={value}
//         placeholder={placeholder}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-lg border px-3 py-2"
//       />
//     </label>
//   );
// }
// function Chips({ label, values, onAdd, onRemove, placeholder, limit }) {
//   const [draft, setDraft] = useState("");
//   const add = () => {
//     const v = draft.trim();
//     if (!v) return;
//     onAdd(v);
//     setDraft("");
//   };
//   return (
//     <div className="text-sm">
//       <div className="mb-1 text-stone-600">{label}</div>
//       <div className="flex flex-wrap gap-2">
//         {values.map((v) => (
//           <span
//             key={v}
//             className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1"
//           >
//             {v}
//             <button
//               type="button"
//               className="text-stone-500 hover:text-stone-800"
//               onClick={() => onRemove(v)}
//             >
//               ×
//             </button>
//           </span>
//         ))}
//       </div>
//       <div className="mt-2 flex gap-2">
//         <input
//           value={draft}
//           onChange={(e) => setDraft(e.target.value)}
//           onKeyDown={(e) => (e.key === "Enter" ? (e.preventDefault(), add()) : null)}
//           placeholder={placeholder}
//           className="w-full rounded-lg border px-3 py-2"
//         />
//         <button
//           type="button"
//           disabled={limit && values.length >= limit}
//           onClick={add}
//           className="rounded-lg border px-3 py-2 disabled:opacity-50"
//         >
//           Add
//         </button>
//       </div>
//       {limit ? (
//         <div className="mt-1 text-xs text-stone-500">
//           {values.length}/{limit}
//         </div>
//       ) : null}
//     </div>
//   );
// }





















import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../context/Store.jsx";
import { uploadImageUnsigned } from "../../lib/cloudinary";
import TinyConfirm from "../../components/admin/TinyConfirm.jsx";
import TinySpinner from "../../components/admin/TinySpinner.jsx";

const AVAILABILITY = ["Available for Sale", "Sold", "On Hold", "Not for Sale"];
const RARITY = ["Unique", "Limited Edition", "Open Edition"];
const UNITS = ["in", "cm"];
const MEDIA = ["Painting", "Drawing", "Sculpture", "Print", "Photography", "Digital"];

export default function ProductForm() {
  const { state, createArtwork, updateArtwork, createSupply, updateSupply } = useStore();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const editingId = params.get("id");
  const kindHint = params.get("kind"); // "art" | "supply"

  const existing = useMemo(() => {
    const all = [...state.artworks, ...state.supplies];
    return all.find((x) => x.id === editingId);
  }, [editingId, state.artworks, state.supplies]);

  const [form, setForm] = useState({
    id: "",
    type: "Art",
    name: "",
    image: "",
    images: [], // 🆕 array of URLs
    price: "",
    currency: "USD",
    collectionId: "",
    category: "",
    year: new Date().getFullYear(),
    rarity: "Unique",
    availability: "Available for Sale",
    medium: "Painting",
    materials: "",
    subject: "",
    styles: [],
    tags: [],
    dimensions: { h: "", w: "", d: "", unit: "in" },
    description: "",
  });

  useEffect(() => {
    if (existing) {
      const existingImages =
        (existing.images && existing.images.length
          ? existing.images
          : (existing.image || existing.imageUrl)
          ? [existing.image || existing.imageUrl]
          : []) || [];

      setForm({
        id: existing.id,
        type: existing.type ?? (kindHint === "supply" ? "Supply" : "Art"),
        name: existing.name ?? "",
        image: existing.image ?? existing.imageUrl ?? existingImages[0] ?? "",
        images: existingImages,
        price: existing.price ?? "",
        currency: existing.currency ?? "USD",
        collectionId: existing.collectionId ?? existing.categoryId ?? "",
        category: existing.category ?? "",
        year: existing.year ?? new Date().getFullYear(),
        rarity: existing.rarity ?? "Unique",
        availability: existing.availability ?? "Available for Sale",
        medium: existing.medium ?? "Painting",
        materials: existing.materials ?? "",
        subject: existing.subject ?? "",
        styles: existing.styles ?? [],
        tags: existing.tags ?? [],
        dimensions:
          existing.dimensions ?? { h: "", w: "", d: "", unit: "in" },
        description: existing.description ?? "",
      });
    } else if (kindHint === "supply") {
      setForm((f) => ({ ...f, type: "Supply" }));
    }
  }, [existing, kindHint]);

  // upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const onFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    try {
      setUploading(true);
      const files = Array.from(fileList);
      const uploadedUrls = [];

      for (const file of files) {
        const { url } = await uploadImageUnsigned(file);
        uploadedUrls.push(url);
      }

      setForm((prev) => {
        const nextImages = [...(prev.images || []), ...uploadedUrls];
        return {
          ...prev,
          images: nextImages,
          // if no main image yet, use first
          image: prev.image || nextImages[0] || "",
        };
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImageAt = (index) => {
    setForm((prev) => {
      const nextImages = [...(prev.images || [])];
      nextImages.splice(index, 1);
      let nextImage = prev.image;

      // if we removed the primary image, set new primary
      if (index === 0) {
        nextImage = nextImages[0] || "";
      }
      return { ...prev, images: nextImages, image: nextImage };
    });
  };

  const makePrimary = (index) => {
    setForm((prev) => {
      const arr = [...(prev.images || [])];
      if (!arr[index]) return prev;
      const [chosen] = arr.splice(index, 1);
      const nextImages = [chosen, ...arr];
      return { ...prev, images: nextImages, image: chosen };
    });
  };

  // confirm + saving states
  const [confirmSave, setConfirmSave] = useState(false);
  const [saving, setSaving] = useState(false);

  const doSave = async () => {
    // final images array: prefer form.images; if empty, fallback to single image
    const images =
      form.images && form.images.length
        ? form.images
        : form.image
        ? [form.image]
        : [];

    const primary = images[0] || form.image || "";

    const payload = {
      ...form,
      images,
      image: primary,
      id:
        form.id ||
        (form.type === "Art"
          ? `art-${crypto.randomUUID().slice(0, 6)}`
          : `sup-${crypto.randomUUID().slice(0, 6)}`),
      price: Number(form.price || 0),
      imageUrl: primary,
      categoryId: form.collectionId || form.category?.toLowerCase(),
      updatedAt: new Date().toISOString(),
      ...(form.id ? {} : { createdAt: new Date().toISOString() }),
    };

    setSaving(true);
    try {
      if (form.type === "Art") {
        existing ? await updateArtwork(payload) : await createArtwork(payload);
      } else {
        existing ? await updateSupply(payload) : await createSupply(payload);
      }
      navigate("/admin/products");
    } finally {
      setSaving(false);
    }
  };

  const addChip = (key, value, limit) => {
    setForm((f) => {
      const arr = Array.isArray(f[key]) ? f[key] : [];
      const v = (value || "").trim();
      if (!v || arr.includes(v)) return f;
      if (limit && arr.length >= limit) return f;
      return { ...f, [key]: [...arr, v] };
    });
  };
  const removeChip = (key, value) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((x) => x !== value) }));

  const submit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.name) return alert("Please enter a product name.");
    if (!form.price && form.type !== "Supply") {
      // you can enforce price here if you want
    }
    setConfirmSave(true); // open confirmation modal
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        {existing ? "Edit" : "New"} {form.type}
      </h1>

      {/* saving overlay */}
      {saving && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/20">
          <div className="rounded-xl bg-white px-4 py-3 shadow">
            <div className="flex items-center gap-2 text-sm">
              <TinySpinner />
              <span>Saving…</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="rounded-xl border bg-white p-6 space-y-6">
        {/* Basic */}
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
            options={["Art", "Supply"]}
          />
          <Input
            label="Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
        </div>

        {/* Collection / Category */}
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Collection (Category)"
            value={form.collectionId}
            onChange={(v) => setForm({ ...form, collectionId: v })}
            options={["", ...state.categories.map((c) => c.id)]}
          />
          <Input
            label="Category (display name)"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            placeholder="Optional — e.g., Abstractum"
          />
          <Input
            label="Year Created"
            type="number"
            value={form.year}
            onChange={(v) =>
              setForm({ ...form, year: v ? Number(v) : "" })
            }
          />
        </div>

        {/* Image & Gallery */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Primary Image URL (optional manual override) */}
          <Input
            label="Primary Image URL"
            value={form.image}
            onChange={(v) => setForm({ ...form, image: v })}
            placeholder="Optional — will default to first uploaded image"
          />

          {/* Upload button + hidden input */}
          <div className="text-sm">
            <div className="mb-1 text-stone-600">Upload Images</div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  onFiles(e.target.files);
                  // reset input so you can re-select the same file if needed
                  e.target.value = "";
                }
              }}
            />

            <button
              type="button"
              onClick={handleClickUpload}
              className="rounded-lg border px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              {form.images && form.images.length > 0
                ? "Add more images"
                : "Upload images"}
            </button>

            {uploading && (
              <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                <TinySpinner /> Uploading…
              </div>
            )}

            <p className="mt-2 text-xs text-stone-500">
              You can upload multiple images. The first one is used as the primary.
            </p>
          </div>

          {/* Gallery Preview */}
          <div className="rounded-lg border">
            <div className="bg-stone-50 px-3 py-2 text-xs font-medium uppercase text-stone-500">
              Images
            </div>
            <div className="p-3">
              {form.images && form.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((url, idx) => (
                    <div key={url + idx} className="relative">
                      <img
                        src={url}
                        alt={`Image ${idx + 1}`}
                        className="h-20 w-full rounded object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Primary
                        </span>
                      )}
                      <div className="absolute right-1 top-1 flex flex-col gap-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => makePrimary(idx)}
                            className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white"
                          >
                            Make primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImageAt(idx)}
                          className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-stone-500">
                  No images yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className="grid gap-4 md:grid-cols-4">
          <Select
            label="Availability"
            value={form.availability}
            onChange={(v) => setForm({ ...form, availability: v })}
            options={AVAILABILITY}
          />
          <Select
            label="Rarity"
            value={form.rarity}
            onChange={(v) => setForm({ ...form, rarity: v })}
            options={RARITY}
          />
          <Select
            label="Currency"
            value={form.currency}
            onChange={(v) => setForm({ ...form, currency: v })}
            options={["USD", "EUR", "GBP", "NGN"]}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: v })}
          />
        </div>

        {/* Dimensions */}
        <fieldset className="rounded-lg border p-4">
          <legend className="px-1 text-xs font-semibold text-stone-500">
            Dimensions
          </legend>
          <div className="grid gap-3 md:grid-cols-5">
            <Input
              label="Height"
              type="number"
              value={form.dimensions.h}
              onChange={(v) =>
                setForm({ ...form, dimensions: { ...form.dimensions, h: v } })
              }
            />
            <Input
              label="Width"
              type="number"
              value={form.dimensions.w}
              onChange={(v) =>
                setForm({ ...form, dimensions: { ...form.dimensions, w: v } })
              }
            />
            <Input
              label="Depth"
              type="number"
              value={form.dimensions.d}
              onChange={(v) =>
                setForm({ ...form, dimensions: { ...form.dimensions, d: v } })
              }
            />
            <Select
              label="Unit"
              value={form.dimensions.unit}
              onChange={(v) =>
                setForm({
                  ...form,
                  dimensions: { ...form.dimensions, unit: v },
                })
              }
              options={UNITS}
            />
            <div className="flex items-end text-sm text-stone-500">
              {form.dimensions.h && form.dimensions.w
                ? `${form.dimensions.h} × ${form.dimensions.w}${
                    form.dimensions.d ? ` × ${form.dimensions.d}` : ""
                  } ${form.dimensions.unit}`
                : "—"}
            </div>
          </div>
        </fieldset>

        {/* Medium & descriptors (art only) */}
        {form.type === "Art" && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Select
                label="Medium"
                value={form.medium}
                onChange={(v) => setForm({ ...form, medium: v })}
                options={MEDIA}
              />
              <Input
                label="Materials"
                value={form.materials}
                onChange={(v) => setForm({ ...form, materials: v })}
                placeholder="e.g., Oil on Canvas"
              />
              <Input
                label="Subject"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
                placeholder="e.g., People and Portraits"
              />
            </div>

            <Chips
              label="Styles (up to 3)"
              placeholder="Type style then Enter…"
              values={form.styles}
              limit={3}
              onAdd={(v) => addChip("styles", v, 3)}
              onRemove={(v) => removeChip("styles", v)}
            />
            <Chips
              label="Tags (up to 5)"
              placeholder="Type tag then Enter…"
              values={form.tags}
              limit={5}
              onAdd={(v) => addChip("tags", v, 5)}
              onRemove={(v) => removeChip("tags", v)}
            />
          </>
        )}

        <TextArea
          label="Description"
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
          placeholder="Brief, compelling description for collectors…"
        />

        <div className="pt-2 flex items-center gap-2">
          <button
            disabled={saving}
            className="rounded-lg bg-stone-900 px-5 py-2 text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {existing ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="rounded-lg border px-5 py-2"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Confirm create/update */}
      <TinyConfirm
        open={confirmSave}
        title={existing ? "Update product?" : "Create product?"}
        message={
          existing
            ? "Save your changes to this product?"
            : "Create this new product with the provided details?"
        }
        confirmText={existing ? "Save Changes" : "Create"}
        onClose={() => setConfirmSave(false)}
        onConfirm={doSave}
      />
    </div>
  );
}

/* ---------- small inputs ---------- */
function Input({ label, value, onChange, type = "text", step, placeholder }) {
  return (
    <label className="text-sm block">
      <div className="mb-1 text-stone-600">{label}</div>
      <input
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="text-sm block">
      <div className="mb-1 text-stone-600">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      >
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o || "—"}
          </option>
        ))}
      </select>
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
function Chips({ label, values, onAdd, onRemove, placeholder, limit }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onAdd(v);
    setDraft("");
  };
  return (
    <div className="text-sm">
      <div className="mb-1 text-stone-600">{label}</div>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1"
          >
            {v}
            <button
              type="button"
              className="text-stone-500 hover:text-stone-800"
              onClick={() => onRemove(v)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" ? (e.preventDefault(), add()) : null
          }
          placeholder={placeholder}
          className="w-full rounded-lg border px-3 py-2"
        />
        <button
          type="button"
          disabled={limit && values.length >= limit}
          onClick={add}
          className="rounded-lg border px-3 py-2 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {limit ? (
        <div className="mt-1 text-xs text-stone-500">
          {values.length}/{limit}
        </div>
      ) : null}
    </div>
  );
}
