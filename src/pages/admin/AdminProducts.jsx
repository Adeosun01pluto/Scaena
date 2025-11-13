import { useMemo, useState } from "react";
import { useStore } from "../../context/Store.jsx";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TinyConfirm from "../../components/admin/TinyConfirm.jsx";
import TinySpinner from "../../components/admin/TinySpinner.jsx";

const fmtDims = (d) =>
  d?.h && d?.w
    ? `${d.h} × ${d.w}${d?.d ? ` × ${d.d}` : ""} ${d?.unit || ""}`
    : "—";

export default function AdminProducts() {
  const { state, deleteArtwork, deleteSupply } = useStore();
  const [type, setType] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { id, kind, name }
  const navigate = useNavigate();

  const rows = useMemo(() => {
    const art = state.artworks.map((x) => ({ ...x, kind: "art" }));
    const sup = state.supplies.map((x) => ({ ...x, kind: "supply" }));
    let all = [...art, ...sup];
    if (type === "art") all = art;
    if (type === "supply") all = sup;
    // newest first if timestamps present
    return all.sort((a, b) =>
      (b.updatedAt || b.createdAt || "").localeCompare(
        a.updatedAt || a.createdAt || ""
      )
    );
  }, [state.artworks, state.supplies, type]);

  const deleting = async ({ id, kind }) => {
    try {
      setBusyId(id);
      if (kind === "art") await deleteArtwork(id);
      else await deleteSupply(id);
    } finally {
      setBusyId(null);
    }
  };

  const isInitialLoading =
    !state.artworks?.length && !state.supplies?.length; // simple heuristic

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-white"
        >
          <Plus size={16} /> New Product
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-3 overflow-x-auto">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-stone-600">Filter:</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="art">Artworks</option>
            <option value="supply">Supplies</option>
          </select>
        </div>

        {/* Loading skeleton */}
        {isInitialLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 w-full animate-pulse rounded bg-stone-100"
              />
            ))}
          </div>
        ) : (
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-stone-50 text-left">
              <tr>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Collection</Th>
                <Th>Year</Th>
                <Th>Medium</Th>
                <Th>Availability</Th>
                <Th>Dimensions</Th>
                <Th>Price</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className={
                    "border-t align-top " +
                    (busyId === p.id ? "opacity-50" : "")
                  }
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || p.imageUrl || ""}
                        alt=""
                        className="h-10 w-10 rounded object-cover bg-stone-100"
                        onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                      />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-stone-500">{p.id}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{p.type || (p.kind === "art" ? "Art" : "Supply")}</Td>
                  <Td>{p.collectionId || p.category || "—"}</Td>
                  <Td>{p.year || "—"}</Td>
                  <Td>{p.medium || (p.kind === "supply" ? "—" : "Painting")}</Td>
                  <Td>{p.availability || "Available for Sale"}</Td>
                  <Td>{fmtDims(p.dimensions)}</Td>
                  <Td>
                    {(p.currency || "USD") + " " + Number(p.price ?? 0).toFixed(2)}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded border px-2 py-1"
                        onClick={() =>
                          navigate(`/admin/products/new?id=${p.id}&kind=${p.kind}`)
                        }
                        aria-label="edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="rounded border px-2 py-1 text-red-600"
                        onClick={() =>
                          setConfirm({ id: p.id, kind: p.kind, name: p.name })
                        }
                        aria-label="delete"
                        disabled={busyId === p.id}
                      >
                        {busyId === p.id ? (
                          <TinySpinner className="align-middle" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm delete */}
      <TinyConfirm
        open={!!confirm}
        title="Delete product?"
        danger
        message={
          confirm
            ? `This will permanently delete “${confirm.name}”. This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        onClose={() => setConfirm(null)}
        onConfirm={() => deleting(confirm)}
      />
    </div>
  );
}

const Th = ({ children }) => (
  <th className="px-3 py-2 text-xs font-medium uppercase text-stone-500">
    {children}
  </th>
);
const Td = ({ children }) => <td className="px-3 py-2">{children}</td>;
